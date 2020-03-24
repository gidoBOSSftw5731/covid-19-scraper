package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/jinzhu/configor"

	"github.com/gidoBOSSftw5731/log"
	_ "github.com/lib/pq"
)

var config = struct {
	DB struct {
		User     string `default:"covid19scraper"`
		Password string `required:"true" env:"DBPassword" default:"ThatsWhatICallInfected"`
		Port     string `default:"5432"`
		IP       string `default:"127.0.0.1"`
	}
}{}

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

var db *sql.DB

const (
	arcgisURL = "https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson"
)

func main() {
	configor.Load(&config, "config.yml")
	log.SetCallDepth(4)

	var err error
	db, err = mkDB()
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

	//var sqlCombined string

	for _, entry := range form.Featuress {
		/*	err = db.QueryRow("SELECT combined FROM records WHERE combined=$1", entry.Properties.OBJECTID).Scan(&sqlCombined)
			switch {
				case err == sql.ErrNoRows:
				case err != nil:
					log.Errorln(err)
					continue
				default:

			}*/

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

		_, err = db.Exec("INSERT INTO records (country, state, county, unixtime, lat, long, deaths, confirmed, tests, recovered, fips, combined, incidentrate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
			p.CountryRegion, p.ProvinceState, p.County, uTimeUnix, p.Lat, p.Long, p.Deaths, p.Confirmed, p.PeopleTested, p.Recovered, p.FIPS, p.CombinedKey, p.IncidentRate)
		if err != nil {
			log.Errorf("Error: %v\nstruct: %v", err, p)
			continue
		}
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

func mkDB() (*sql.DB, error) {
	return sql.Open("postgres", fmt.Sprintf("user=%v password=%v dbname=covid19scraper host=%v port=%v",
		config.DB.User, config.DB.Password, config.DB.IP, config.DB.Port))
	/*
		create database covid19scraper;
		create user covid19scraper with encrypted password 'ThatsWhatICallInfected';
		CREATE TABLE records (
		country text,
		state text,
		county text,
		unixtime int,
		lat float,
		long float,
		deaths int,
		confirmed int,
		tests int,
		recovered int,
		fips int,
		combined text,
		incidentrate float,
		inserttime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
		GRANT ALL ON ALL TABLES IN SCHEMA public TO covid19scraper;
		create index idx_combined on records (combined);
	*/
}
