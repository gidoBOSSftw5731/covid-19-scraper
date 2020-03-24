package main

import (
	"database/sql"

	"../goconf"
	"github.com/gidoBOSSftw5731/log"
	"github.com/jinzhu/configor"
)

var (
	config goconf.Config
	db     *sql.DB
)

func main() {
	configor.Load(config, "config.yml")
	log.SetCallDepth(4)

	var err error
	db, err = goconf.MkDB(&config)
	if err != nil {
		log.Fatalln(err)
	}
	db.Ping()

}
