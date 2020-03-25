const Discord = require("discord.js")
const client = new Discord.Client()

client.on("ready", () => {
    console.log(`Client user tag: ${client.user.tag}!`)
})

client.on("message", msg => {
    if (msg.content === "GA") {
        msg.reply("1097 Confirmed Cases in Georgia")
    }
})

client.login("NjkyMTE3MjA2MTA4MjA5MjUz.Xnqxsw.w_X_kQ4duMdgtyFu8gKaO29HYzk")