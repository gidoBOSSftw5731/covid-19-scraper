module github.com/gidoBOSSftw5731/covid-19-scraper/discord_bot_go

go 1.13

require (
	github.com/bwmarrin/discordgo v0.20.2
	github.com/gidoBOSSftw5731/covid-19-scraper/apiListener v0.0.0-20200403014957-70a768045fbd
	github.com/gidoBOSSftw5731/covid-19-scraper/tools v0.0.0-00010101000000-000000000000
	github.com/gidoBOSSftw5731/log v0.0.0-20190718204308-3ae037c6203f
	github.com/joho/godotenv v1.3.0
	github.com/wcharczuk/go-chart v2.0.2-0.20190910040548-3a7bc5543113+incompatible
	google.golang.org/protobuf v1.20.2-0.20200320194150-9d397869d892
)

replace github.com/gidoBOSSftw5731/covid-19-scraper/tools => ../tools
