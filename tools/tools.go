// Package tools contains tools used in the covid19 bot operations.
package tools

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"sort"
	"time"

	pb "github.com/gidoBOSSftw5731/covid-19-scraper/apiListener/proto"
	"github.com/gidoBOSSftw5731/log"
	chart "github.com/wcharczuk/go-chart"
	"github.com/wcharczuk/go-chart/drawing"
)

// ChartCases is a function that takes AreaInfo as input and returns a picture as a graph
func ChartCases(info *pb.HistoricalInfo, doConfirmed, doDeaths bool) (io.Reader, error) {
	caseMap := make(map[int64]*pb.AreaInfo)
	var orderedKeys []int64

	// Make a map of cases keyed by timestamp.
	// Also, collect the timestamps in a slice.(to later sort)
	for _, i := range info.Info {
		caseMap[i.UnixTimeOfRequest] = i
		orderedKeys = append(orderedKeys, i.UnixTimeOfRequest)
	}

	// Sort that timestamp slice now.
	sort.Slice(orderedKeys, func(i, j int) bool {
		return orderedKeys[i] < orderedKeys[j]
	})
	// Create a slice (ordered) of time.Time for x-axis use later.
	var timeKeys []time.Time
	for _, j := range orderedKeys {
		timeKeys = append(timeKeys, time.Unix(j, 0))
	}

	var caseStatsSorted []float64
	var deathStatsSorted []float64

	// Extract from each case (in timestamp order) the opened/dead case numbers.
	for _, i := range orderedKeys {
		if doConfirmed {
			caseStatsSorted = append(caseStatsSorted, float64(caseMap[int64(i)].ConfirmedCases))
		}
		if doDeaths {
			deathStatsSorted = append(deathStatsSorted, float64(caseMap[int64(i)].Deaths))
		}
	}

	// For safety sake later make sure there's at least one real number in the lists.
	if len(caseStatsSorted) == 0 {
		caseStatsSorted = append(caseStatsSorted, 0)
	}
	if len(deathStatsSorted) == 0 {
		deathStatsSorted = append(deathStatsSorted, 0)
	}

	// Construct the timeSeries data sets for cases/deaths.
	cSeries := chart.TimeSeries{
		Name:    "Confirmed Cases",
		XValues: timeKeys,
		YValues: caseStatsSorted,
		Style: chart.Style{
			StrokeColor: drawing.ColorGreen,               // will supercede defaults
			FillColor:   drawing.ColorGreen.WithAlpha(64), // will supercede defaults
		},
	}
	dSeries := chart.TimeSeries{
		Name:    "Deaths due to COVID-19",
		XValues: timeKeys,
		YValues: deathStatsSorted,
		Style: chart.Style{
			StrokeColor: drawing.ColorRed,               // will supercede defaults
			FillColor:   drawing.ColorRed.WithAlpha(64), // will supercede defaults
		},
	}

	// Create the graph/Chart with the new series attached.
	graph := chart.Chart{
		YAxis: chart.YAxis{
			ValueFormatter: func(v interface{}) string {
				if vf, isFloat := v.(float64); isFloat {
					return fmt.Sprintf("%0.0f", vf)
				}
				return ""
			},
			Style: chart.Style{
				FontSize:  14,
				FontColor: drawing.ColorWhite,
			},
		},
		XAxis: chart.XAxis{
			Style: chart.Style{
				FontSize:  14,
				FontColor: drawing.ColorWhite,
			},
		},
		Background: chart.Style{
			FillColor: drawing.ColorFromHex("808080"),
		},
		Canvas: chart.Style{
			FillColor: drawing.ColorFromHex("d3d3d3"),
		},
		Series: []chart.Series{
			cSeries,
			dSeries,
		},
		Log: chart.NewLogger(),
	}

	// Note: we have to do this as a separate step because we need a reference to graph
	graph.Elements = []chart.Renderable{
		chart.Legend(
			&graph,
			chart.Style{
				FontSize:  11,
				FontColor: drawing.ColorBlack,
			}),
	}

	var f bytes.Buffer
	err := graph.Render(chart.PNG, &f)
	if err != nil {
		return nil, err
	}
	log.Traceln("wrote to file")

	return bufio.NewReader(&f), nil
}
