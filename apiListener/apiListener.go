package main

import (
	"database/sql"
	"fmt"
	"net"
	"net/http"
	"net/http/fcgi"
	"os"
	"path/filepath"
	"strings"

	"github.com/gidoBOSSftw5731/covid-19-scraper/apiListener/goconf"
	pb "github.com/gidoBOSSftw5731/covid-19-scraper/apiListener/proto"
	"github.com/gidoBOSSftw5731/log"
	"github.com/golang/protobuf/proto"
	"github.com/jinzhu/configor"
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
		if len(urlSplit) >= 2 {
			ErrorHandler(resp, req, 400, "Specify a state or county there bud")
			return
		}
		if len(urlSplit) == 3 {
			//indentify by state
		} else if len(urlSplit) == 4 {
			//identify by county
		} else {
			ErrorHandler(resp, req, 400, "Too many arguments")
			return
		}
	case "liststates":
		if len(urlSplit) < 2 {
			ErrorHandler(resp, req, 400, "Ya did it wrong (this is a logically impossible error)")
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

			resp.Write(stateListByte)
		} else if len(urlSplit) == 4 {
			//list counties
		} else {
			ErrorHandler(resp, req, 400, "Too many arguments")
			return
		}
	case "tos":
		http.ServeFile(resp, req, filepath.Join(wd, "ToS.html"))
	case "robots.txt":
		http.ServeFile(resp, req, "robots.txt")
	default:
		ErrorHandler(resp, req, 400, "Bad request")
		return
	}
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

	i := 0
	for rows.Next() {
		var country string
		rows.Scan(&country, &stateList.States[i])
		if country != stateList.Country {
			log.Errorln("Returned state for a different country? not exiting")
		}

		i++
	}
	return stateList, nil
}
