package main

import (
	"os"

	"github.com/bwmarrin/discordgo"
	"github.com/gidoBOSSftw5731/log"

	"github.com/joho/godotenv"
)

var (
	botID         string
	commandPrefix string
	discordToken  string
)

func main() {
	log.SetCallDepth(4)

	err := godotenv.Load()
	errCheck("error getting env stuff ", err)
	discordToken = os.Getenv("BOT_TOKEN")
	commandPrefix = os.Getenv("BOT_PREFIX")

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

}
