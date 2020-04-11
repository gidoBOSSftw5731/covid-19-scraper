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
	// h prefix means historical, c prefix means current
	stmtMap  = make(map[string]*sql.Stmt)
	queryMap = map[string]string{
		"hCountyQuery": `SELECT date_trunc('day', inserttime) as inserttime, sum(deaths) as deaths,
		sum(confirmed) as confirmed,
		sum(tests) as tests,
		sum(recovered) as recovered
		FROM (
			SELECT inserttime,
			sum(deaths) as deaths,
			sum(confirmed) as confirmed,
			sum(tests) as tests,
			sum(recovered) as recovered,
			count(combined) as combined
			FROM records
			WHERE country = $1
			AND state = $2
			AND county = $3
			AND inserttime > inserttime - interval '10 sec'
			AND inserttime < inserttime + interval '10 sec'
			GROUP BY inserttime
			ORDER BY inserttime desc) records
		GROUP BY inserttime
		ORDER BY inserttime desc`,

		"hStateQuery": `SELECT date_trunc('day', inserttime) as inserttime, sum(deaths) as deaths,
					sum(confirmed) as confirmed,
					sum(tests) as tests,
					sum(recovered) as recovered
					FROM (
						SELECT inserttime,
						sum(deaths) as deaths,
						sum(confirmed) as confirmed,
						sum(tests) as tests,
						sum(recovered) as recovered,
						count(combined) as combined
						FROM records
						WHERE country = $1
						AND state = $2
						AND inserttime > inserttime - interval '10 sec'
						AND inserttime < inserttime + interval '10 sec'
						GROUP BY inserttime
						ORDER BY inserttime desc) records
					GROUP BY inserttime
					ORDER BY inserttime desc`,

		"hCountryQuery": `SELECT date_trunc('day', inserttime) as inserttime, sum(deaths) as deaths,
						sum(confirmed) as confirmed,
						sum(tests) as tests,
						sum(recovered) as recovered
						FROM (
							SELECT inserttime,
							sum(deaths) as deaths,
							sum(confirmed) as confirmed,
							sum(tests) as tests,
							sum(recovered) as recovered,
							count(combined) as combined
							FROM records
							WHERE country = $1
							AND inserttime > inserttime - interval '10 sec'
							AND inserttime < inserttime + interval '10 sec'
							GROUP BY inserttime
							ORDER BY inserttime desc) records
						GROUP BY inserttime
						ORDER BY inserttime desc`,

		"cCountyQuery": `SELECT lat, long, deaths, confirmed, COALESCE(tests,0),
						recovered, COALESCE(incidentrate,0), inserttime
						   FROM currentdata
						  WHERE country=$1
							AND state=$2
							  AND county=$3`,

		"cStateQuery": `SELECT lat, long, deaths, confirmed, COALESCE(tests,0),
					recovered, COALESCE(incidentrate,0), inserttime
					FROM currentdata
					WHERE country=$1
					AND state=$2`,

		"cCountryQuery": `SELECT lat, long, deaths, confirmed, COALESCE(tests,0),
		recovered, COALESCE(incidentrate,0), inserttime
						   FROM currentdata
						  WHERE country=$1`,

		"tenWorstQuery": `SELECT lat, long, deaths, confirmed, COALESCE(tests,0),
		recovered, inserttime, combined
						   FROM currentdata
						  WHERE country=$1
						  ORDER BY confirmed DESC
						  limit 10`,

		"listStatesQuery":   `SELECT DISTINCT country, state FROM records WHERE country = $1`,
		"listCountiesQuery": `SELECT DISTINCT county FROM records WHERE country = $1 AND state = $2`,
	}
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

	// If the database is not alive, exit now.
	if db.Ping() != nil {
		log.Fatalln(db.Ping())
	}

	// do this in a different goroutine to not hold up other processes
	defineSQLStatements()

	log.Traceln("Listening")
	//  Start the fcgi listener, we use fcgi so we can have a loadbalancer and a cache upstream
	listener, err := net.Listen("tcp", "127.0.0.1:9001")
	if err != nil {
		log.Fatalln(err)
	}
	var h newFCGI
	fcgi.Serve(listener, h)
}

func defineSQLStatements() {

	for i, j := range queryMap {
		var err error
		stmtMap[i], err = db.Prepare(j)
		if err != nil {
			log.Fatalln(err)
		}
	}
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
		if len(urlSplit) <= 2 {
			ErrorHandler(resp, req, 400, "Specify a state or county there bud")
			return
		}
		switch len(urlSplit) {
		case 4:
			data, err := stateData(urlSplit[2], urlSplit[3])
			if err != nil {
				log.Errorln(err)
				ErrorHandler(resp, req, 404, "Bad Data")
			}

			dataByte, err := proto.Marshal(data)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			log.Traceln(data)
			resp.Write([]byte(base64.StdEncoding.EncodeToString(dataByte)))
		case 5:
			data, err := countyData(urlSplit[2], urlSplit[3], urlSplit[4])
			if err != nil {
				log.Errorln(err)
				ErrorHandler(resp, req, 404, "Bad Data")
			}

			dataByte, err := proto.Marshal(data)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			log.Traceln(data)
			resp.Write([]byte(base64.StdEncoding.EncodeToString(dataByte)))
		case 3:
			data, err := countryData(urlSplit[2])
			if err != nil {
				log.Errorln(err)
				ErrorHandler(resp, req, 404, "Bad Data")
			}

			dataByte, err := proto.Marshal(data)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			log.Traceln(data)
			resp.Write([]byte(base64.StdEncoding.EncodeToString(dataByte)))
		default:
			ErrorHandler(resp, req, 400, "Too many arguments")
			return
		}
	case "liststates":
		if len(urlSplit) < 2 {
			ErrorHandler(resp, req, 400, "Ya did it wrong (this is a logically impossible error)") // aight bet
			return
		}
		if len(urlSplit) == 3 {
			stateList, err := listStates(urlSplit[2])
			if err != nil {
				log.Errorln(err)
				ErrorHandler(resp, req, 404, "Returned Nothing, country not available")
				return
			}

			stateListByte, err := proto.Marshal(stateList)
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

			countyListByte, err := proto.Marshal(countyList)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			resp.Write([]byte(base64.StdEncoding.EncodeToString(countyListByte)))
		} else {
			ErrorHandler(resp, req, 400, "Too many arguments")
			return
		}
	case "top10worst":
		switch len(urlSplit) {
		case 3:
			worst, err := topTenWorstCounties(urlSplit[2])
			if err != nil {
				log.Errorln(err)
				ErrorHandler(resp, req, 404, "Returned Nothing, country not available")
				return
			}

			worstByte, err := proto.Marshal(worst)
			if err != nil {
				ErrorHandler(resp, req, 500, "Marshalling error")
				return
			}

			log.Traceln(worst)
			resp.Write([]byte(base64.StdEncoding.EncodeToString(worstByte)))
		default:
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

			dataByte, err := proto.Marshal(data)
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

			dataByte, err := proto.Marshal(data)
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

			dataByte, err := proto.Marshal(data)
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

func topTenWorstCounties(country string) (*pb.HistoricalInfo, error) {
	//hInfo := &pb.HistoricalInfo{}
	rows, err := stmtMap["tenWorstQuery"].Query(country)
	if err != nil {
		return nil, err
	}

	hInfo := rowsToHistoricalInfo(rows, pb.AreaInfo_COUNTY, true)

	// infoMap is a map of per insertTime to data record at that time.
	//infoMap := make(map[time.Time]*pb.AreaInfo)

	log.Tracef("%v elements", len(hInfo.Info))

	//log.Traceln(infoMap)
	return hInfo, nil
}

func countryData(country string) (*pb.HistoricalInfo, error) {
	//hInfo := &pb.HistoricalInfo{}
	rows, err := stmtMap["hCountryQuery"].Query(country)
	if err != nil {
		return nil, err
	}

	hInfo := rowsToHistoricalInfo(rows, pb.AreaInfo_COUNTRY, false)

	// infoMap is a map of per insertTime to data record at that time.
	//infoMap := make(map[time.Time]*pb.AreaInfo)

	log.Tracef("%v elements", len(hInfo.Info))

	//log.Traceln(infoMap)
	return hInfo, nil
}

func stateData(country, state string) (*pb.HistoricalInfo, error) {
	//hInfo := &pb.HistoricalInfo{}
	rows, err := stmtMap["hStateQuery"].Query(country, state)
	if err != nil {
		return nil, err
	}

	hInfo := rowsToHistoricalInfo(rows, pb.AreaInfo_STATE, false)

	// infoMap is a map of per insertTime to data record at that time.
	//infoMap := make(map[time.Time]*pb.AreaInfo)

	log.Tracef("%v elements", len(hInfo.Info))

	//log.Traceln(infoMap)
	return hInfo, nil
}

func rowsToHistoricalInfo(rows *sql.Rows, areatype pb.AreaInfo_LocationType, hasLocation bool) *pb.HistoricalInfo {
	hInfo := &pb.HistoricalInfo{}

	switch hasLocation {
	case false:
		for rows.Next() {
			var info pb.AreaInfo
			var insertTime time.Time

			if err := rows.Scan(&insertTime, &info.Deaths, &info.ConfirmedCases,
				&info.TestsGiven, &info.Recoveries); err != nil {
				log.Errorln(err)
				continue
			}
			info.UnixTimeOfRequest = insertTime.Unix()
			info.Type = areatype
			hInfo.Info = append(hInfo.Info, &info)
		}
	case true:
		for rows.Next() {
			var info pb.AreaInfo
			var insertTime time.Time

			if err := rows.Scan(&info.Lat, &info.Long, &info.Deaths, &info.ConfirmedCases,
				&info.TestsGiven, &info.Recoveries, &insertTime, &info.CombinedKey); err != nil {
				log.Errorln(err)
				continue
			}
			info.UnixTimeOfRequest = insertTime.Unix()
			info.Type = areatype
			hInfo.Info = append(hInfo.Info, &info)
		}
	}

	return hInfo
}

func currentStateInfo(country, state string) (*pb.AreaInfo, error) {
	cInfo := &pb.AreaInfo{}
	rows, err := stmtMap["cStateQuery"].Query(country, state)
	if err != nil {
		log.Errorln(err)
		return nil, err
	}

	rows.Next()
	var insertTime time.Time
	err = rows.Scan(&cInfo.Lat, &cInfo.Long, &cInfo.Deaths, &cInfo.ConfirmedCases,
		&cInfo.TestsGiven, &cInfo.Recoveries, &cInfo.Incidentrate, &insertTime)
	if err != nil {
		log.Errorln(err)
		return nil, err
	}

	cInfo.Type = pb.AreaInfo_STATE
	cInfo.UnixTimeOfRequest = insertTime.Unix()

	for rows.Next() {
		var info pb.AreaInfo
		var insertTime time.Time
		err = rows.Scan(&info.Lat, &info.Long, &info.Deaths, &info.ConfirmedCases,
			&info.TestsGiven, &info.Recoveries, &info.Incidentrate, &insertTime)
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

func currentCountryInfo(country string) (*pb.AreaInfo, error) {
	cInfo := &pb.AreaInfo{}
	rows, err := stmtMap["cCountryQuery"].Query(country)
	if err != nil {
		log.Errorln(err)
		return nil, err
	}

	rows.Next()
	var insertTime time.Time
	err = rows.Scan(&cInfo.Lat, &cInfo.Long, &cInfo.Deaths, &cInfo.ConfirmedCases,
		&cInfo.TestsGiven, &cInfo.Recoveries, &cInfo.Incidentrate, &insertTime)
	if err != nil {
		log.Errorln(err)
		return nil, err
	}

	cInfo.Type = pb.AreaInfo_COUNTRY
	cInfo.UnixTimeOfRequest = insertTime.Unix()

	for rows.Next() {
		var info pb.AreaInfo
		var insertTime time.Time
		err = rows.Scan(&info.Lat, &info.Long, &info.Deaths, &info.ConfirmedCases,
			&info.TestsGiven, &info.Recoveries, &info.Incidentrate, &insertTime)
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

func currentCountyInfo(country, state, county string) (*pb.AreaInfo, error) {
	cInfo := &pb.AreaInfo{}
	rows, err := stmtMap["cCountyQuery"].Query(country, state, county)
	if err != nil {
		log.Errorln(err)
		return nil, err
	}

	rows.Next()
	var insertTime time.Time
	err = rows.Scan(&cInfo.Lat, &cInfo.Long, &cInfo.Deaths, &cInfo.ConfirmedCases,
		&cInfo.TestsGiven, &cInfo.Recoveries, &cInfo.Incidentrate, &insertTime)
	if err != nil {
		log.Errorln(err)
		return nil, err
	}

	cInfo.Type = pb.AreaInfo_COUNTY
	cInfo.UnixTimeOfRequest = insertTime.Unix()

	for rows.Next() {
		var info pb.AreaInfo
		var insertTime time.Time
		err = rows.Scan(&info.Lat, &info.Long, &info.Deaths, &info.ConfirmedCases,
			&info.TestsGiven, &info.Recoveries, &info.Incidentrate, &insertTime)
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

func listStates(country string) (*pb.ListOfStates, error) {
	stateList := &pb.ListOfStates{}

	rows, err := stmtMap["listStatesQuery"].Query(country)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		return stateList, fmt.Errorf("missing rows")
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

func listCounties(country, state string) (*pb.ListOfCounties, error) {
	countyList := &pb.ListOfCounties{}

	rows, err := stmtMap["listCountiesQuery"].Query(country, state)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		return countyList, fmt.Errorf("missing rows")
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

func countyData(country, state, county string) (*pb.HistoricalInfo, error) {
	//countyData := &pb.HistoricalInfo{}

	rows, err := stmtMap["hCountyQuery"].Query(country, state, county)
	if err != nil {
		log.Errorln(err)
		return nil, err
	}

	countyData := rowsToHistoricalInfo(rows, pb.AreaInfo_COUNTY, false)

	return countyData, nil
}

/*
and I will save you for later
		var county pb.AreaInfo
		err = db.QueryRow("SELECT lat, long, deaths, confirmed, tests, recovered, incidentrate, inserttime FROM (SELECT combined, lat, long, deaths, confirmed, tests, recovered, incidentrate, inserttime ROW_NUMBER() OVER (PARTITION BY combined ORDER BY time_stamp DESC) rn FROM records) tmp WHERE rn = 1 AND county = $1",
	countyName).Scan(&county.Lat, &county.Long, &)
*/
