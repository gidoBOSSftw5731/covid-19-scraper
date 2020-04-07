package main

import (
	"os"

	"github.com/bwmarrin/discordgo"
	"github.com/gidoBOSSftw5731/log"
	"github.com/joho/godotenv"
)

var (
	//botID         string
	//commandPrefix string
	discordToken string
	//apiURL        string
	//stateMap map[string]string
)

func main() {
	log.SetCallDepth(4)

	err := godotenv.Load()
	errCheck("error getting env stuff ", err)
	discordToken = os.Getenv("BOT_TOKEN")
	//commandPrefix = os.Getenv("BOT_PREFIX")
	//apiURL = os.Getenv("API_URL")

	//jsonData, err := ioutil.ReadFile("./stateConversions.json")
	//errCheck("JSON ERROR: ", err)

	//json.Unmarshal(jsonData, &stateMap)

	discord, err := discordgo.New("Bot " + discordToken)
	errCheck("error creating discord session", err)
	//user, err := discord.User("@me")
	errCheck("error retrieving account", err)

	//botID = user.ID

	err = discord.Open()
	errCheck("Error opening connection to Discord", err)
	defer discord.Close()

	discord.ChannelMessageSend("695838084687986738", "!activate")
}

func errCheck(msg string, err error) {
	if err != nil {
		log.Fatalf("%s: %+v", msg, err)
	}

}
