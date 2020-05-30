package main

import (
	"bufio"
	"database/sql"
	"encoding/csv"
	"io"
	"os"
	"strconv"
	"time"

	"github.com/gidoBOSSftw5731/covid-19-scraper/goconf"
	"github.com/gidoBOSSftw5731/log"
	"github.com/jinzhu/configor"
	"github.com/lib/pq"
)

type nytData struct {
	date,
	county,
	state,
	fips,
	cases,
	deaths string
	fipsint int
}

var (
	Config  goconf.Config
	db, db2 *sql.DB
)

func main() {
	log.SetCallDepth(4)
	configor.Load(&Config, "config.yml")

	f, _ := os.Open("covid-19-data/us-counties.csv")
	reader := csv.NewReader(bufio.NewReader(f))
	var data []nytData

	for {
		line, err := reader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			log.Fatal(err)
		}

		if line[0] == "date" {
			continue
		}
		if line[3] == "" {
			line[3] = "0"
			if line[1] == "Unknown" {
				line[1] = "Unassigned"
			}
		}

		fipsint, _ := strconv.Atoi(line[3])

		data = append(data, nytData{line[0], line[1], line[2], line[3], line[4], line[5], fipsint})
	}

	// who needs errors?
	db, _ = goconf.MkDB(&Config)
	db2, _ = goconf.MkDB(&Config)

	txn, err := db.Begin()
	if err != nil {
		log.Panicln(err)
	}

	stmt, err := txn.Prepare(pq.CopyIn("records", "country", "state", "county",
		"unixtime", "deaths", "confirmed", "fips", "combined", "lat", "long", "inserttime",
		"recovered", "tests"))
	if err != nil {
		log.Panicln(err)
	}

Loop:
	for _, i := range data {
		var combined string
		var lat, long float64
		t, _ := time.Parse("2006-01-02", i.date)
		ut := t.Unix()
		var rows *sql.Rows
		if i.fipsint != 0 {
			rows, err = db2.Query("SELECT combined, lat, long, inserttime FROM records WHERE fips = $1",
				i.fipsint)
		} else {
			rows, err = db2.Query("SELECT combined, lat, long, inserttime FROM records WHERE county = $1 AND state = $2",
				i.county, i.state)
		}
		if err != nil {
			log.Errorln(err)
			if err != sql.ErrNoRows {

			} else {
				log.Errorln("FIPS not found for ", i)
			}
		}

		for rows.Next() {
			var st time.Time
			rows.Scan(&combined, &lat, &long, &st)
			if t.YearDay() == st.YearDay() {
				//	log.Errorln(t)
				rows.Close()
				continue Loop
			}
		}

		// should not have data for that day

		deaths, _ := strconv.Atoi(i.deaths)
		cases, _ := strconv.Atoi(i.cases)
		if ut < 0 {
			log.Errorln("Not adding ", i)
			continue
		}

		_, err = stmt.Exec("US", i.state, i.county, strconv.FormatInt(ut, 10),
			deaths, cases, i.fipsint, combined, lat, long, t, 0, 0)
		if err != nil {
			log.Panicln(err)
		}
		rows.Close()
	}
	stmt.Exec()
	txn.Commit()
}
