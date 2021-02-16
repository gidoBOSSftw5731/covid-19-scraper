module github.com/gidoBOSSftw5731/covid-19-scraper/discord_bot_go

go 1.13

require (
	github.com/blend/go-sdk v2.0.0+incompatible // indirect
	github.com/bwmarrin/discordgo v0.23.2
	github.com/gidoBOSSftw5731/covid-19-scraper/apiListener v0.0.0-20200410231514-aab58f7698cb
	github.com/gidoBOSSftw5731/covid-19-scraper/tools v0.0.0-20200410231514-aab58f7698cb
	github.com/gidoBOSSftw5731/log v0.0.0-20190718204308-3ae037c6203f
	github.com/gorilla/websocket v1.4.2 // indirect
	github.com/joho/godotenv v1.3.0
	golang.org/x/crypto v0.0.0-20201221181555-eec23a3978ad // indirect
	golang.org/x/sys v0.0.0-20210124154548-22da62e12c0c // indirect
	google.golang.org/protobuf v1.20.2-0.20200320194150-9d397869d892
)

replace github.com/gidoBOSSftw5731/covid-19-scraper/tools => ../tools
