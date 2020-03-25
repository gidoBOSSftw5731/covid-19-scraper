require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client()

client.on("ready", () => {
    console.log(`Client user tag: ${client.user.tag}!`)
})

client.on("message", msg => {
    if (msg.content === "!signin") {
        msg.reply(msg.author.id)
        user(msg.author.id)
    }
})

client.login(process.env.BOT_TOKEN)

//Firebase (?)
const firebase = require("firebase/app");
var admin = require("firebase-admin");

var serviceAccount = require("./coronavirusbot19-firebase-adminsdk-sckiv-6ca1e54162.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://coronavirusbot19.firebaseio.com"
});

let db = admin.firestore()

function user(id) {
    let userDoc = db.collection('users').doc(id).set({
        id: id
    })
}