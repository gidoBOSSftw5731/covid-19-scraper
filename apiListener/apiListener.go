package main

import (
	"database/sql"
	"net"
	"net/http"
	"net/http/fcgi"

	"../goconf"
	"github.com/gidoBOSSftw5731/log"
	"github.com/jinzhu/configor"
)

type newFCGI struct{}

var (
	config goconf.Config
	db     *sql.DB
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

	//begin fcgi listener, we use fcgi so we can have a loadbalancer and a cache upstream
	listener, err := net.Listen("tcp", "127.0.0.1:9001")
	if err != nil {
		log.Fatalln(err)
	}
	var h newFCGI
	fcgi.Serve(listener, h)
}

func (h newFCGI) ServeHTTP(resp http.ResponseWriter, req *http.Request) {

}
