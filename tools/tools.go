package tools

import (
	"bufio"
	"io"
	"os"
	"sort"
	"time"

	pb "github.com/gidoBOSSftw5731/covid-19-scraper/apiListener/proto"
	"github.com/gidoBOSSftw5731/log"
	"github.com/wcharczuk/go-chart"
)

// ChartCases is a function that takes an AreaInfo as input and returns a picture as a graph
func ChartCases(info *pb.HistoricalInfo, doConfirmed, doDeaths bool) (io.Reader, error) {
	caseMap := make(map[int64]*pb.AreaInfo)
	var orderedKeys []int64
	//log.Traceln(info.Info)

	for _, i := range info.Info {
		caseMap[i.UnixTimeOfRequest] = i
		orderedKeys = append(orderedKeys, i.UnixTimeOfRequest)
	}

	sort.Slice(orderedKeys, func(i, j int) bool {
		return orderedKeys[i] < orderedKeys[j]
	})

	var caseStatsSorted []float64
	var deathStatsSorted []float64

	for _, i := range orderedKeys {
		if doConfirmed {
			caseStatsSorted = append(caseStatsSorted, float64(caseMap[int64(i)].ConfirmedCases))
		}
		if doDeaths {
			deathStatsSorted = append(deathStatsSorted, float64(caseMap[int64(i)].Deaths))
		}
	}

	if len(caseStatsSorted) == 0 {
		caseStatsSorted = append(caseStatsSorted, 0)
	}
	if len(deathStatsSorted) == 0 {
		deathStatsSorted = append(deathStatsSorted, 0)
	}

	var timeKeys []time.Time
	for _, j := range orderedKeys {
		//log.Traceln(i, j)
		t := time.Unix(j, 0)
		timeKeys = append(timeKeys, t)
	}

	graph := chart.Chart{
		Series: []chart.Series{
			chart.TimeSeries{
				Name:    "Confirmed Cases",
				XValues: timeKeys,
				YValues: caseStatsSorted,
			},
			chart.TimeSeries{
				Name:    "Deaths due to COVID-19",
				XValues: timeKeys,
				YValues: deathStatsSorted,
			},
		},
	}

	f, _ := os.Create("output.png")
	//defer f.Close()
	err := graph.Render(chart.PNG, f)
	if err != nil {
		//log.Errorln(err)
		return nil, err
	}
	log.Traceln("wrote to file")

	f.Seek(0, 0)

	return bufio.NewReader(f), nil
}
