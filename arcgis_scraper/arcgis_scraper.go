package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"../goconf"

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
	log.SetCallDepth(4)

	var err error
	db, err = MkDB(&config)
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

	// Create a DB Transaction, one atomic change with many rows inserted.
	txn, err := db.Begin()
	if err != nil {
		log.Fatalf("failed to create transation: %v", err)
	}

	// Create the cursor, which gets filled with the Exec statement inside the for loop.
	stmt, err := txn.Prepare(
		pq.CopyIn("records", "country", "state", "county", "unixtime",
			"lat", "long", "deaths", "confirmed",
			"tests", "recovered", "fips", "combined",
			"incidentrate"))
	if err != nil {
		log.Fatalf("failed to create cursor: %v", err)
	}

	for _, entry := range form.Featuress {
		p := &entry.Properties

		uTime, err := time.Parse(time.RFC3339, p.LastUpdate)
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

		_, err = stmt.Exec(p.CountryRegion, p.ProvinceState, p.County, uTimeUnix, p.Lat,
			p.Long, p.Deaths, p.Confirmed, p.PeopleTested, p.Recovered, p.FIPS,
			p.CombinedKey, p.IncidentRate)
		if err != nil {
			log.Fatalf("failed to exec the cursor: %v\nstruct: %v", err, p)
		}
	}

	// All data is pending in the transaction, commit the transaction.
	_, err = stmt.Exec()
	if err != nil {
		log.Fatalf("failed to commit downloaded data: %v", err)
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
