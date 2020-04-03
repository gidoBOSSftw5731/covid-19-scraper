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
func ChartCases(info *pb.HistoricalInfo) (io.Reader, error) {
	caseMap := make(map[int64]uint32)
	var orderedKeys []int64
	//log.Traceln(info.Info)

	for _, i := range info.Info {
		caseMap[i.UnixTimeOfRequest] = i.ConfirmedCases
		orderedKeys = append(orderedKeys, i.UnixTimeOfRequest)

	}

	sort.Slice(orderedKeys, func(i, j int) bool {
		return orderedKeys[i] < orderedKeys[j]
	})

	var caseStatsSorted []float64

	for _, i := range orderedKeys {
		caseStatsSorted = append(caseStatsSorted, float64(caseMap[int64(i)]))

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
				Style: chart.Style{
					StrokeColor: chart.GetDefaultColor(0).WithAlpha(64),
					FillColor:   chart.GetDefaultColor(0).WithAlpha(64),
					//Show:        true,
				},
				XValues: timeKeys,
				YValues: caseStatsSorted,
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
