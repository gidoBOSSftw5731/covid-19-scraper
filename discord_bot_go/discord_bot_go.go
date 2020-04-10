package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"
	"strings"

	"github.com/bwmarrin/discordgo"
	pb "github.com/gidoBOSSftw5731/covid-19-scraper/apiListener/proto"
	"github.com/gidoBOSSftw5731/covid-19-scraper/tools"
	"github.com/gidoBOSSftw5731/log"
	"google.golang.org/protobuf/proto"

	"github.com/joho/godotenv"
)

var (
	botID         string
	commandPrefix string
	discordToken  string
	apiURL        string
	stateMap      map[string]string
)

const (
	testing = false // please make this false on prod
)

func main() {
	log.SetCallDepth(4)

	err := godotenv.Load()
	errCheck("error getting env stuff ", err)
	discordToken = os.Getenv("BOT_TOKEN")
	commandPrefix = os.Getenv("BOT_PREFIX")
	apiURL = os.Getenv("API_URL")

	jsonData, err := ioutil.ReadFile("./stateConversions.json")
	errCheck("JSON ERROR: ", err)

	json.Unmarshal(jsonData, &stateMap)

	discord, err := discordgo.New("Bot " + discordToken)
	errCheck("error creating discord session", err)
	user, err := discord.User("@me")
	errCheck("error retrieving account", err)

	botID = user.ID
	switch testing {
	case false:
		discord.AddHandler(commandHandler)
	case true:
		discord.AddHandler(testcommandHandler)
	}
	discord.AddHandler(func(discord *discordgo.Session, ready *discordgo.Ready) {
		err = discord.UpdateStatus(2, "alone, not by choice, but by law")
		if err != nil {
			log.Errorln("Error attempting to set my status")
		}
		servers := discord.State.Guilds
		log.Debugf("Covid19Bot has started on %d servers", len(servers))
	})

	err = discord.Open()
	errCheck("Error opening connection to Discord", err)
	defer discord.Close()

	<-make(chan struct{})

}

func errCheck(msg string, err error) {
	if err != nil {
		log.Fatalf("%s: %+v", msg, err)
	}

}

func testcommandHandler(discord *discordgo.Session, message *discordgo.MessageCreate) {
	user := message.Author
	log.Tracef("Bot ID: %v, User ID %v, Channel ID: %v", botID, user.ID, message.ChannelID)

	if user.ID == botID && message.ChannelID != "696894398293737512" {
		//Do nothing because the bot is talking outside of #updates
		return
	}

	if !(message.Content[:len(commandPrefix)] == commandPrefix) {
		return
	}

	command := strings.Split(message.Content, commandPrefix)[1]
	commandContents := strings.Split(message.Content, " ") // 0 = !command, 1 = first arg, etc
	if len(commandContents) < 2 {
		log.Errorln("didnt supply enough args")
		//discord.ChannelMessageSend(message.ChannelID, "Error in formatting!")
		return
	}

	switch strings.Split(command, " ")[0] {

	}
}

func commandHandler(discord *discordgo.Session, message *discordgo.MessageCreate) {
	user := message.Author
	if user.ID == botID && message.ChannelID != "696894398293737512" {
		//Do nothing because the bot is talking outside of #updates
		fmt.
		return
	}

	if !(message.Content[:len(commandPrefix)] == commandPrefix) {
		return
	}

	command := strings.Split(message.Content, commandPrefix)[1]
	commandContents := strings.Split(message.Content, " ") // 0 = !command, 1 = first arg, etc

	if len(commandContents) == 0 {
		log.Errorln("didnt supply enough args")
		//discord.ChannelMessageSend(message.ChannelID, "Error in formatting!")
		return
	}

	switch strings.Split(command, " ")[0] {
	case "cases":
		country := "US" // change this if we support more than just good ol' 'murica
		var state string
		var county string

		if len(commandContents) >= 2 {
			state = commandContents[len(commandContents)-1]
			county = strings.Title(strings.Join(commandContents[1:len(commandContents)-1], " "))

			isAbbreviated, err := regexp.MatchString(".{2}", state)
			if err != nil {
				log.Errorln(err)
				return
			}

			if isAbbreviated {
				state = stateMap[strings.ToUpper(state)]
			}
		}

		queryURL := apiURL + "/currentinfo/" + country + "/" + state + "/" + county

		location := county
		if county == "" {
			queryURL = queryURL[:len(queryURL)-1]
			location = state
		}
		if state == "" {
			queryURL = queryURL[:len(queryURL)-1]
			location = country
		}

		log.Tracef("QueryURL: %v", queryURL)

		resp, err := http.Get(queryURL)
		if err != nil {
			log.Errorln(err)
			return
		}

		defer resp.Body.Close()

		buf := new(bytes.Buffer)
		buf.ReadFrom(resp.Body)

		log.Tracef("Base64 data: %v", buf.String())

		protoIn, err := base64.StdEncoding.DecodeString(buf.String())
		if err != nil {
			log.Errorln(err)
			return
		}

		newAreaInfo := &pb.AreaInfo{}

		err = proto.Unmarshal(protoIn, newAreaInfo)
		if err != nil {
			log.Errorln(err)
			return
		}

		msgStr := fmt.Sprintf("The %v of %v has %v cases, %v deaths, has given %v tests, and has %v recoveries!",
			strings.ToLower(fmt.Sprint(newAreaInfo.Type)), location, newAreaInfo.ConfirmedCases,
			newAreaInfo.Deaths, newAreaInfo.TestsGiven, newAreaInfo.Recoveries)
		discord.ChannelMessageSend(message.ChannelID, msgStr)
	case "graph":
		country := "US" // change this if we support more than just good ol' 'murica
		var state string
		var county string

		if len(commandContents) >= 2 {
			state = commandContents[len(commandContents)-1]
			county = strings.Title(strings.Join(commandContents[1:len(commandContents)-1], " "))

			isAbbreviated, err := regexp.MatchString(".{2}", state)
			if err != nil {
				log.Errorln(err)
				return
			}

			if isAbbreviated {
				state = stateMap[strings.ToUpper(state)]
			}
		}

		queryURL := apiURL + "/stateinfo/" + country + "/" + state + "/" + county

		location := county
		if county == "" {
			queryURL = queryURL[:len(queryURL)-1]
			location = state
		}
		if state == "" {
			queryURL = queryURL[:len(queryURL)-1]
			location = country
		}

		log.Tracef("QueryURL: %v", queryURL)

		resp, err := http.Get(queryURL)
		if err != nil {
			log.Errorln(err)
			return
		}

		defer resp.Body.Close()

		buf := new(bytes.Buffer)
		buf.ReadFrom(resp.Body)

		//log.Tracef("Base64 data: %v", buf.String())

		protoIn, err := base64.StdEncoding.DecodeString(buf.String())
		if err != nil {
			log.Errorln(err)
			return
		}

		newHInfo := &pb.HistoricalInfo{}
		err = proto.Unmarshal(protoIn, newHInfo)
		if err != nil {
			log.Errorln(err)
			return
		}

		log.Traceln(newHInfo)

		f, err := tools.ChartCases(newHInfo, true, true)
		if err != nil {
			log.Errorln(err)
			return
		}

		_, err = discord.ChannelFileSend(message.ChannelID, location+".png", f)
		if err != nil {
			log.Errorln(err)
			return
		}

	case "botcases":
		country := "US" // change this if we support more than just good ol' 'murica
		var state string
		var county string

		//sre := regexp.MustCompile(`:{5}[\w(\w )]+:{5}`)
		//cre := regexp.MustCompile(`;{5}[\w(\w )]+;{5}`)
		if len(commandContents) >= 2 {
			state = commandContents[len(commandContents)-2]
			county = strings.Title(strings.Join(commandContents[1:len(commandContents)-2], " "))

			isAbbreviated, err := regexp.MatchString(".{2}", state)
			if err != nil {
				log.Errorln(err)
				return
			}

			if isAbbreviated {
				state = stateMap[strings.ToUpper(state)]
			}
		}

		id := commandContents[len(commandContents)-1]

		queryURL := apiURL + "/currentinfo/" + country + "/" + state + "/" + county
		log.Traceln(state)

		location := county
		if county == "" {
			queryURL = queryURL[:len(queryURL)-1]
			location = state
		}
		//if state == "" {
		//	queryURL = queryURL[:len(queryURL)-1]
		//	location = country
		//}

		log.Tracef("QueryURL: %v", queryURL)

		resp, err := http.Get(queryURL)
		if err != nil {
			log.Errorln(err)
			return
		}

		defer resp.Body.Close()

		buf := new(bytes.Buffer)
		buf.ReadFrom(resp.Body)

		log.Tracef("Base64 data: %v", buf.String())

		protoIn, err := base64.StdEncoding.DecodeString(buf.String())
		if err != nil {
			log.Errorln(err)
			return
		}

		newAreaInfo := &pb.AreaInfo{}

		err = proto.Unmarshal(protoIn, newAreaInfo)
		if err != nil {
			log.Errorln(err)
			return
		}

		msgStr := fmt.Sprintf("%v The %v of %v has %v cases, %v deaths, has given %v tests, and has %v recoveries!",
			id, strings.ToLower(fmt.Sprint(newAreaInfo.Type)), location, newAreaInfo.ConfirmedCases,
			newAreaInfo.Deaths, newAreaInfo.TestsGiven, newAreaInfo.Recoveries)
		discord.ChannelMessageSend(message.ChannelID, msgStr)
	}
}
