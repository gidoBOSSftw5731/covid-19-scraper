package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/gidoBOSSftw5731/log"
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
	Admin2        string      `json:"Admin2"`
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

const (
	arcgisURL     = "https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson"
	knownAccurate = "known_accurate"
)

func main() {
	log.SetCallDepth(4)
	stateByte, err := ioutil.ReadFile("stateConversions.json") // credit to https://gist.github.com/mshafrir/2646763
	if err != nil {
		log.Fatalln(err)
	}
	states := string(stateByte)
	//Load states into map
	stateMap := make(map[string]string)
	err = json.Unmarshal([]byte(states), &stateMap)
	if err != nil {
		log.Panicln(err)
	}

	//Download ARCGIS data
	resp, err := http.Get(arcgisURL)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	jsonIn := buf.String()

	var form arcgis

	err = json.Unmarshal([]byte(jsonIn), &form)
	if err != nil {
		log.Panicln(err)
	}

	//Load the directory of the states and their stats
	validStates, err := ioutil.ReadDir(knownAccurate)
	if err != nil {
		log.Fatalln(err)
	}

	statsMap := make(map[string]int)

	//Put all states into the previously made map
	for _, stateInfo := range validStates {
		state := stateInfo.Name()
		stateFile, err := ioutil.ReadFile(filepath.Join(knownAccurate, state))
		if err != nil {
			log.Fatalln(err)
		}

		statsMap[stateMap[state]], _ = strconv.Atoi(string(stateFile))
	}

	arcgisStats := make(map[string]int)

	//put arcgis stats into map
	for _, jsonEntry := range form.Featuress {
		arcgisStats[jsonEntry.Properties.ProvinceState] += jsonEntry.Properties.Confirmed
	}

	for _, stateInfo := range validStates {
		state := stateInfo.Name()
		fullState := stateMap[state]

		if arcgisStats[fullState] != statsMap[fullState] {
			log.Errorf("Difference in state %v! AG: %v Scraper: %v", fullState, arcgisStats[fullState], statsMap[fullState])
		}
	}
}
