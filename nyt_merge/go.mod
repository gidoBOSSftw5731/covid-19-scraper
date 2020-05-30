module github.com/gidoBOSSftw5731/covid-19-scraper/nyt_merge

go 1.13

replace github.com/gidoBOSSftw5731/covid-19-scraper/goconf => ../goconf

require (
	github.com/gidoBOSSftw5731/covid-19-scraper/goconf v0.0.0-00010101000000-000000000000
	github.com/gidoBOSSftw5731/log v0.0.0-20190718204308-3ae037c6203f
	github.com/jinzhu/configor v1.2.0
	github.com/lib/pq v1.6.0
)
