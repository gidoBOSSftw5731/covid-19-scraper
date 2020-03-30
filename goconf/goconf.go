package goconf

import (
	"database/sql"
	"fmt"

	//pq is imported because below is a psql db that is made
	_ "github.com/lib/pq"
)

//Config is a struct intended to be loaded with the Configor package
type Config struct {
	DB struct {
		User     string `default:"covid19scraper"`
		Password string `required:"true" env:"DBPassword" default:"ThatsWhatICallInfected"`
		Port     string `default:"5432"`
		IP       string `default:"127.0.0.1"`
	}
}

//MkDB is a function that takes a config struct and returns a pointer to a database.
func MkDB(config *Config) (*sql.DB, error) {
	//var err error
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
create index idxr_country_state_county on records (country, state, county);
create index idxr_country_state on records (country, state);
create index idxr_country on records (country);
CREATE TABLE currentdata (
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
create index idxc_country_state_county on currentdata (country, state, county);
create index idxc_country_state on currentdata (country, state);
create index idxc_country on currentdata (country);
GRANT ALL ON ALL TABLES IN SCHEMA public TO covid19scraper;
	*/
}
