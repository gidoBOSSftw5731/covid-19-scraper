package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/bwmarrin/discordgo"
	pb "github.com/gidoBOSSftw5731/covid-19-scraper/apiListener/proto"
	"github.com/gidoBOSSftw5731/log"
	"google.golang.org/protobuf/proto"

	"github.com/joho/godotenv"
)

var (
	botID         string
	commandPrefix string
	discordToken  string
	apiURL        string
)

func main() {
	log.SetCallDepth(4)

	err := godotenv.Load()
	errCheck("error getting env stuff ", err)
	discordToken = os.Getenv("BOT_TOKEN")
	commandPrefix = os.Getenv("BOT_PREFIX")
	apiURL = os.Getenv("API_URL")

	discord, err := discordgo.New("Bot " + discordToken)
	errCheck("error creating discord session", err)
	user, err := discord.User("@me")
	errCheck("error retrieving account", err)

	botID = user.ID
	discord.AddHandler(commandHandler)
	discord.AddHandler(func(discord *discordgo.Session, ready *discordgo.Ready) {
		err = discord.UpdateStatus(2, "Go Away!")
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

func commandHandler(discord *discordgo.Session, message *discordgo.MessageCreate) {
	user := message.Author
	if user.ID == botID || user.Bot {
		//Do nothing because the bot is talking
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
	case "cases":
		state := commandContents[len(commandContents)-1]
		county := strings.Title(strings.Join(commandContents[1:len(commandContents)-1], " "))
		country := "US" // change this if we support more than just good ol' 'murica

		queryURL := apiURL + "/currentinfo/" + country + "/" + state + "/" + county

		if county == "" {
			queryURL = queryURL[:len(queryURL)-1]
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
		}

		msgStr := fmt.Sprintf("The %v of %v has %v cases, %v deaths, has given %v tests, and has %v recoveries!",
			newAreaInfo.Type, "foo", newAreaInfo.ConfirmedCases, newAreaInfo.Deaths, newAreaInfo.TestsGiven, newAreaInfo.Recoveries)
		discord.ChannelMessageSend(message.ChannelID, msgStr)

	}
}
