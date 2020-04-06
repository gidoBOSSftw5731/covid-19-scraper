package main

import (
	"database/sql"
	"encoding/base64"
	"fmt"
	"net"
	"net/http"
	"net/http/fcgi"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gidoBOSSftw5731/covid-19-scraper/apiListener/goconf"
	pb "github.com/gidoBOSSftw5731/covid-19-scraper/apiListener/proto"
	"github.com/gidoBOSSftw5731/log"
	"github.com/jinzhu/configor"
	"google.golang.org/protobuf/proto"
)

type newFCGI struct{}

var (
	config goconf.Config
	db     *sql.DB
	wd, _  = os.Getwd()
)

func main() {
	//Boilerplate config
	configor.Load(&config, "config.yml")
	log.SetCallDepth(4)

	//init the DB
	var err error
	db, err = goconf.MkDB(&config)
	if err != nil {
		log.Fatalln(err)
	}
	//ping and fatal on error (sometimes catches bugs)
	if db.Ping() != nil {
		log.Fatalln(db.Ping())
	}

	log.Traceln("Listening")
	//begin fcgi listener, we use fcgi so we can have a loadbalancer and a cache upstream
	listener, err := net.Listen("tcp", "127.0.0.1:9001")
	if err != nil {
		log.Fatalln(err)
	}
	var h newFCGI
	fcgi.Serve(listener, h)
}

func (h newFCGI) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	urlSplit := strings.Split(req.URL.Path, "/")

	if len(urlSplit) < 2 {
		ErrorHandler(resp, req, 400,
			"This is the API, please make a request (in place of docs, DM GidoBOSSftw5731#6422 on discord")
		return
	}

	log.Traceln(urlSplit)

	switch urlSplit[1] {
	case "stateinfo":
		if len(urlSplit) <= 3 {
			ErrorHandler(resp, req, 400, "Specify a state or county there bud")
			return
		}
		if len(urlSplit) == 4 {
			data, err := stateData(urlSplit[2], urlSplit[3])
			if err != nil {
				log.Errorln(err)
				ErrorHandler(resp, req, 404, "Bad Data")
			}

			dataByte, err := proto.Marshal(&data)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			log.Traceln(data)
			resp.Write([]byte(base64.StdEncoding.EncodeToString(dataByte)))
		} else if len(urlSplit) == 5 {
			data, err := countyData(urlSplit[2], urlSplit[3], urlSplit[4])
			if err != nil {
				log.Errorln(err)
				ErrorHandler(resp, req, 404, "Bad Data")
			}

			dataByte, err := proto.Marshal(&data)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			log.Traceln(data)
			resp.Write([]byte(base64.StdEncoding.EncodeToString(dataByte)))
		} else {
			ErrorHandler(resp, req, 400, "Too many arguments")
			return
		}
	case "liststates":
		if len(urlSplit) < 2 {
			ErrorHandler(resp, req, 400, "Ya did it wrong (this is a logically impossible error)") // aight bet
			return
		}
		if len(urlSplit) == 3 {
			//log.Traceln(urlSplit[2])
			stateList, err := listStates(urlSplit[2])
			if err != nil {
				log.Errorln(err)
				ErrorHandler(resp, req, 404, "Returned Nothing, country not available")
				return
			}

			stateListByte, err := proto.Marshal(&stateList)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			resp.Write([]byte(base64.StdEncoding.EncodeToString(stateListByte)))
		} else if len(urlSplit) == 4 {
			countyList, err := listCounties(urlSplit[2], urlSplit[3])
			if err != nil {
				log.Errorln(err)
				ErrorHandler(resp, req, 404, "Returned Nothing, country not available")
				return
			}

			countyListByte, err := proto.Marshal(&countyList)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			resp.Write([]byte(base64.StdEncoding.EncodeToString(countyListByte)))
		} else {
			ErrorHandler(resp, req, 400, "Too many arguments")
			return
		}
	case "currentinfo":
		if len(urlSplit) < 3 {
			ErrorHandler(resp, req, 400, "argument missing")
			return
		}
		switch len(urlSplit) {
		case 3:
			data, err := currentCountryInfo(urlSplit[2])
			if err != nil {
				ErrorHandler(resp, req, 500, "Query error")
			}

			dataByte, err := proto.Marshal(&data)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			//log.Traceln(data)
			resp.Write([]byte(base64.StdEncoding.EncodeToString(dataByte)))
		case 4:
			data, err := currentStateInfo(urlSplit[2], urlSplit[3])
			if err != nil {
				ErrorHandler(resp, req, 500, "Query error")
			}

			dataByte, err := proto.Marshal(&data)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			//log.Traceln(data)
			resp.Write([]byte(base64.StdEncoding.EncodeToString(dataByte)))
		case 5:
			data, err := currentCountyInfo(urlSplit[2], urlSplit[3], urlSplit[4])
			if err != nil {
				ErrorHandler(resp, req, 500, "Query error")
			}

			dataByte, err := proto.Marshal(&data)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			//log.Traceln(data)
			resp.Write([]byte(base64.StdEncoding.EncodeToString(dataByte)))
		default:
			ErrorHandler(resp, req, 400, "too many arguments")
			return
		}
	case "tos":
		http.ServeFile(resp, req, filepath.Join(wd, "ToS.html"))
	case "proto":
		http.ServeFile(resp, req, filepath.Join(wd, "proto/api.proto"))
	case "robots.txt":
		http.ServeFile(resp, req, "robots.txt")
	default:
		ErrorHandler(resp, req, 400, "Bad request")
		return
	}
}

func stateData(country, state string) (pb.HistoricalInfo, error) {
	var hInfo pb.HistoricalInfo
	rows, err := db.Query("SELECT lat, long, deaths, confirmed, COALESCE(tests,0), recovered, COALESCE(incidentrate,0), inserttime FROM records  WHERE country=$1 AND state=$2",
		country, state)
	if err != nil {
		return hInfo, err

	}

	infoMap := make(map[time.Time]*pb.AreaInfo)

	for rows.Next() {
		var info pb.AreaInfo
		var insertTime time.Time
		err = rows.Scan(&info.Lat, &info.Long, &info.Deaths, &info.ConfirmedCases, &info.TestsGiven, &info.Recoveries, &info.Incidentrate, &insertTime)
		if err != nil {
			log.Errorln(err)
			continue
		}

		unique := true
		for i, j := range infoMap {
			if inTimeSpan(insertTime.Add(-12*time.Hour), insertTime.Add(12*time.Hour), i) {
				unique = false
				//foo := j
				j.Deaths += info.Deaths
				j.Recoveries += info.Recoveries
				j.ConfirmedCases += info.ConfirmedCases
				j.TestsGiven += info.TestsGiven
				// once incident rate is defined in ARCGIS, I'll figure out how to handle it
				//log.Traceln(info.ConfirmedCases)
				//fmt.Printf("Old %v\n New %v\n", foo, j)
				break
			}
		}
		if unique {
			infoMap[insertTime] = &info
		}
	}

	log.Tracef("%v elements", len(infoMap))

	for _, i := range infoMap {
		i.Type = pb.AreaInfo_STATE
		hInfo.Info = append(hInfo.Info, i)
		log.Traceln(i.ConfirmedCases)
	}

	log.Traceln(infoMap)
	return hInfo, nil

}

func currentStateInfo(country, state string) (pb.AreaInfo, error) {
	var cInfo pb.AreaInfo
	rows, err := db.Query("SELECT lat, long, deaths, confirmed, COALESCE(tests,0), recovered, COALESCE(incidentrate,0), inserttime FROM currentdata WHERE country=$1 AND state=$2",
		country, state)
	if err != nil {
		return cInfo, err

	}

	rows.Next()
	var insertTime time.Time
	err = rows.Scan(&cInfo.Lat, &cInfo.Long, &cInfo.Deaths, &cInfo.ConfirmedCases, &cInfo.TestsGiven, &cInfo.Recoveries, &cInfo.Incidentrate, &insertTime)
	if err != nil {
		log.Errorln(err)
		return cInfo, err
	}

	cInfo.Type = pb.AreaInfo_STATE

	cInfo.UnixTimeOfRequest = insertTime.Unix()

	for rows.Next() {
		var info pb.AreaInfo
		var insertTime time.Time
		err = rows.Scan(&info.Lat, &info.Long, &info.Deaths, &info.ConfirmedCases, &info.TestsGiven, &info.Recoveries, &info.Incidentrate, &insertTime)
		if err != nil {
			log.Errorln(err)
			continue
		}

		cInfo.Deaths += info.Deaths
		cInfo.Recoveries += info.Recoveries
		cInfo.ConfirmedCases += info.ConfirmedCases
		cInfo.TestsGiven += info.TestsGiven

		//log.Tracef("%v, %v", info.ConfirmedCases, cInfo.ConfirmedCases)
	}

	return cInfo, nil
}

func currentCountryInfo(country string) (pb.AreaInfo, error) {
	var cInfo pb.AreaInfo
	rows, err := db.Query("SELECT lat, long, deaths, confirmed, COALESCE(tests,0), recovered, COALESCE(incidentrate,0), inserttime FROM currentdata  WHERE country=$1",
		country)
	if err != nil {
		return cInfo, err

	}

	rows.Next()
	var insertTime time.Time
	err = rows.Scan(&cInfo.Lat, &cInfo.Long, &cInfo.Deaths, &cInfo.ConfirmedCases, &cInfo.TestsGiven, &cInfo.Recoveries, &cInfo.Incidentrate, &insertTime)
	if err != nil {
		log.Errorln(err)
		return cInfo, err
	}

	cInfo.Type = pb.AreaInfo_COUNTRY

	cInfo.UnixTimeOfRequest = insertTime.Unix()

	for rows.Next() {
		var info pb.AreaInfo
		var insertTime time.Time
		err = rows.Scan(&info.Lat, &info.Long, &info.Deaths, &info.ConfirmedCases, &info.TestsGiven, &info.Recoveries, &info.Incidentrate, &insertTime)
		if err != nil {
			log.Errorln(err)
			continue
		}

		cInfo.Deaths += info.Deaths
		cInfo.Recoveries += info.Recoveries
		cInfo.ConfirmedCases += info.ConfirmedCases
		cInfo.TestsGiven += info.TestsGiven
	}

	return cInfo, nil
}

func currentCountyInfo(country, state, county string) (pb.AreaInfo, error) {
	var cInfo pb.AreaInfo
	rows, err := db.Query("SELECT lat, long, deaths, confirmed, COALESCE(tests,0), recovered, COALESCE(incidentrate,0), inserttime FROM currentdata WHERE country=$1 AND state=$2 AND county=$3",
		country, state, county)
	if err != nil {
		return cInfo, err

	}

	rows.Next()
	var insertTime time.Time
	err = rows.Scan(&cInfo.Lat, &cInfo.Long, &cInfo.Deaths, &cInfo.ConfirmedCases, &cInfo.TestsGiven, &cInfo.Recoveries, &cInfo.Incidentrate, &insertTime)
	if err != nil {
		log.Errorln(err)
		return cInfo, err
	}

	cInfo.Type = pb.AreaInfo_COUNTY

	cInfo.UnixTimeOfRequest = insertTime.Unix()

	for rows.Next() {
		var info pb.AreaInfo
		var insertTime time.Time
		err = rows.Scan(&info.Lat, &info.Long, &info.Deaths, &info.ConfirmedCases, &info.TestsGiven, &info.Recoveries, &info.Incidentrate, &insertTime)
		if err != nil {
			log.Errorln(err)
			continue
		}

		cInfo.Deaths += info.Deaths
		cInfo.Recoveries += info.Recoveries
		cInfo.ConfirmedCases += info.ConfirmedCases
		cInfo.TestsGiven += info.TestsGiven
	}

	return cInfo, nil
}

//ErrorHandler is a function to handle HTTP errors
func ErrorHandler(resp http.ResponseWriter, req *http.Request, status int, alert string) {
	resp.WriteHeader(status)
	log.Errorf("HTTP error: %v, witty message: %v", status, alert)
	fmt.Fprintf(resp, "You have found an error! This error is of type %v. Built in alert: \n'%v',\n Would you like a <a href='https://http.cat/%v'>cat</a> or a <a href='https://httpstatusdogs.com/%v'>dog?</a>",
		status, alert, status, status)
}

func listStates(country string) (pb.ListOfStates, error) {
	var stateList pb.ListOfStates

	rows, err := db.Query("SELECT DISTINCT country, state FROM records WHERE country = $1", country)
	if err != nil {
		return stateList, err
	}
	defer rows.Close()

	if !rows.Next() {
		return stateList, fmt.Errorf("Missing rows")
	}

	stateList.Country = country

	for rows.Next() {
		var country, state string
		rows.Scan(&country, &state)
		if country != stateList.Country {
			log.Errorln("Returned state for a different country? not exiting")
		}

		stateList.States = append(stateList.States, state)

	}
	return stateList, nil
}

func listCounties(country, state string) (pb.ListOfCounties, error) {
	var countyList pb.ListOfCounties

	rows, err := db.Query("SELECT DISTINCT county FROM records WHERE country = $1 AND state = $2",
		country, state)
	if err != nil {
		return countyList, err
	}
	defer rows.Close()

	if !rows.Next() {
		return countyList, fmt.Errorf("Missing rows")
	}

	countyList.Country = country
	countyList.State = state

	for rows.Next() {
		var countyName string
		rows.Scan(&countyName)

		countyList.Counties = append(countyList.Counties, countyName)

	}
	return countyList, nil
}

func countyData(country, state, county string) (pb.HistoricalInfo, error) {
	var countyData pb.HistoricalInfo

	rows, err := db.Query("SELECT lat, long, deaths, confirmed, COALESCE(tests,0), recovered, COALESCE(incidentrate,0), inserttime FROM records  WHERE country=$1 AND state=$2 AND county=$3",
		country, state, county)
	if err != nil {
		return countyData, err
	}

	infoMap := make(map[time.Time]*pb.AreaInfo)

	for rows.Next() {
		var countyinfo pb.AreaInfo
		var insertTime time.Time
		err = rows.Scan(&countyinfo.Lat, &countyinfo.Long, &countyinfo.Deaths, &countyinfo.ConfirmedCases,
			&countyinfo.TestsGiven, &countyinfo.Recoveries, &countyinfo.Incidentrate, &insertTime)
		if err != nil {
			log.Errorln(err)
			continue
		}

		countyinfo.UnixTimeOfRequest = insertTime.Unix()

		countyinfo.Type = pb.AreaInfo_COUNTY

		unique := true
		for i, j := range infoMap {
			if inTimeSpan(insertTime.Add(-12*time.Hour), insertTime.Add(12*time.Hour), i) {
				if j.ConfirmedCases == countyinfo.ConfirmedCases &&
					j.TestsGiven == countyinfo.TestsGiven &&
					j.Deaths == countyinfo.Deaths &&
					j.Recoveries == countyinfo.Recoveries {
					unique = false
					break
				}

			}
		}
		if unique {
			infoMap[insertTime] = &countyinfo
			countyData.Info = append(countyData.Info, &countyinfo)
		}

		log.Traceln(countyinfo.ConfirmedCases, unique, insertTime)

		//countyData.Info = append(countyData.Info, &countyinfo)

	}

	return countyData, nil
}

func inTimeSpan(start, end, check time.Time) bool {
	return check.After(start) && check.Before(end)
}

/*
and I will save you for later
		var county pb.AreaInfo
		err = db.QueryRow("SELECT lat, long, deaths, confirmed, tests, recovered, incidentrate, inserttime FROM (SELECT combined, lat, long, deaths, confirmed, tests, recovered, incidentrate, inserttime ROW_NUMBER() OVER (PARTITION BY combined ORDER BY time_stamp DESC) rn FROM records) tmp WHERE rn = 1 AND county = $1",
	countyName).Scan(&county.Lat, &county.Long, &)
*/
