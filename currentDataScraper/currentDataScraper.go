package main

//If you were curious, I made this by copy and pasting arcgis_scraper then making a few basic tweaks

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gidoBOSSftw5731/covid-19-scraper/goconf"

	"github.com/gidoBOSSftw5731/log"
	"github.com/jinzhu/configor"
	"github.com/lib/pq"
)

const (
	arcgisURL = "https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson"
)

var (
	db     *sql.DB
	config goconf.Config
)

type arcgis struct {
	Featuress []Features `json:"features"`
	Type      string     `json:"type"`
}

type Features struct {
	Geometry   `json:"geometry"`
	Properties `json:"properties"`
	Type       string `json:"type"`
}

type Geometry struct {
	Coordinates []float64 `json:"coordinates"`
	Type        string    `json:"type"`
}

type Properties struct {
	Active        int         `json:"Active"`
	County        string      `json:"Admin2"`
	CombinedKey   string      `json:"Combined_Key"`
	Confirmed     int         `json:"Confirmed"`
	CountryRegion string      `json:"Country_Region"`
	Deaths        int         `json:"Deaths"`
	FIPS          string      `json:"FIPS"`
	IncidentRate  interface{} `json:"Incident_Rate"`
	LastUpdate    string      `json:"Last_Update"`
	Lat           float64     `json:"Lat"`
	Long          float64     `json:"Long_"`
	OBJECTID      int         `json:"OBJECTID"`
	PeopleTested  interface{} `json:"People_Tested"`
	ProvinceState string      `json:"Province_State"`
	Recovered     int         `json:"Recovered"`
}

func main() {
	configor.Load(&config, "config.yml")
	log.SetCallDepth(3)

	var err error
	db, err = goconf.MkDB(&config)
	if err != nil {
		log.Fatalln(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalln(err)
	}

	loopingDownloader()

}

// looping Downloader is intended to run in the background, downloading the data from ArcGIS every 5 minutes
// and adding any new entries to the database
func loopingDownloader() {
	form, err := downloadArcgis()
	if err != nil {
		log.Fatalln(err)
	}

	jsonMap := make(map[string]bool)

	// I hate literally everything
	// no exceptions
	// seriously, none
	// dont push me on this
	rows, err := db.Query("SELECT combined FROM currentdata")
	switch err {
	case sql.ErrNoRows, nil:
	default:
		log.Fatalln("Error checking for rows")
	}

	for rows.Next() {
		var ckey string
		rows.Scan(&ckey)

		jsonMap[ckey] = true
	}

	// Create a DB Transaction, one atomic change with many rows inserted.
	txn, err := db.Begin()
	if err != nil {
		log.Fatalf("failed to create transation: %v", err)
	}

	txn2, err := db.Begin()
	if err != nil {
		log.Fatalf("failed to create transation: %v", err)
	}

	// Create the cursor, which gets filled with the Exec statement inside the for loop.
	iStmt, err := txn.Prepare(
		pq.CopyIn("currentdata", "country", "state", "county", "unixtime",
			"lat", "long", "deaths", "confirmed",
			"tests", "recovered", "fips", "combined",
			"incidentrate"))
	uStmt, err := txn2.Prepare("UPDATE currentdata SET unixtime = $1, deaths = $2, confirmed = $3, tests = $4, recovered = $5, incidentrate = $6 WHERE country = $7 AND state = $8 AND county = $9")

	for _, entry := range form.Featuress {
		p := &entry.Properties
		log.Traceln(p.CombinedKey)

		uTime, err := time.Parse("2006/01/02 15:04:05+07", p.LastUpdate)
		if err != nil {
			log.Errorln(err)
			continue
		}
		uTimeUnix := uTime.Unix()

		if p.PeopleTested == nil {
			p.PeopleTested = 0
		}

		if p.FIPS == "" {
			p.FIPS = "0"
		}

		exists := jsonMap[p.CombinedKey]
		log.Traceln(exists)

		switch exists {
		case true:
			_, err = uStmt.Exec(uTimeUnix, p.Deaths, p.Confirmed, p.PeopleTested,
				p.Recovered, p.IncidentRate, p.CountryRegion, p.ProvinceState, p.County)
			if err != nil {
				log.Fatalf("failed to exec the cursor: %v\nstruct: %v", err, p)
			}
		case false:
			_, err = iStmt.Exec(p.CountryRegion, p.ProvinceState, p.County, uTimeUnix, p.Lat,
				p.Long, p.Deaths, p.Confirmed, p.PeopleTested, p.Recovered, p.FIPS,
				p.CombinedKey, p.IncidentRate)
			if err != nil {
				log.Fatalf("failed to exec the cursor: %v\nstruct: %v", err, p)
			}
		}

	}

	// All data is pending in the transaction, commit the transaction.
	_, err = iStmt.Exec()
	if err != nil {
		log.Fatalf("failed to commit downloaded data: %v", err)
	}

	log.Traceln(db.Ping())

	err = txn2.Commit()
	if err != nil {
		log.Fatalln(err)
	}

	if err := txn.Commit(); err != nil {
		log.Fatalf("failed to commit and close the transaction: %v", err)
	}

}

func downloadArcgis() (arcgis, error) {
	var form arcgis
	//Download ARCGIS data
	resp, err := http.Get(arcgisURL)
	if err != nil {
		return form, err
	}
	defer resp.Body.Close()

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	jsonIn := buf.String()

	err = json.Unmarshal([]byte(jsonIn), &form)
	if err != nil {
		return form, err
	}
	return form, nil
}
