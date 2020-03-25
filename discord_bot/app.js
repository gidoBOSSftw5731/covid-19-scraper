require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client()
const firebase = require("firebase/app");
var admin = require("firebase-admin");

var serviceAccount = require("./coronavirusbot19-firebase-adminsdk-sckiv-6ca1e54162.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://coronavirusbot19.firebaseio.com"
});

let db = admin.firestore();

const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

client.on("ready", () => {
    console.log(`Client user tag: ${client.user.tag}!`);
})

client.on("message", msg => {
    if (msg.content === "!signin") {
        msg.reply(msg.author.id);
        user(msg.author.id);
    }
    
    if (!msg.content.startsWith("!") || msg.author.bot) return;

    const args = msg.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    if (command === "location") {
        if (!args.length) {
            return msg.reply("To use location command, please follow the paradigm:\n" +
            "```!location <state> <county (optional)>```\n Note: At this moment, only the US is supported.");
        } else if (!states.includes(args[0])) {
            return msg.reply('Looks like you may have entered the parameters wrong!\n Please follow the paradigm:\n' +
                "```!location <state> <county (optional)>```\n Note: At this moment, only the US is supported.");
        } else {
            location(msg.author.id, args, msg.channel);
        }
    }
})

function user(id) {
    let userDoc = db.collection('users').doc(id).set({
        id: id
    });
}

function location(id, args, channel) {
    var o = "";
    for (i = 0; i < args.length; i++) {
        if (i == 0) {
            let updateState = db.collection('users').doc(id).update({ state: args[0] });
            o += "State: " + args[0];
        } else if (i == 1) {
            let updateCounty = db.collection('users').doc(id).update({ county: args[1] });
            o += ", County: " + args[1];
        }
    }
    channel.send(`Location added!\n${o}`);
}

client.login(process.env.BOT_TOKEN)