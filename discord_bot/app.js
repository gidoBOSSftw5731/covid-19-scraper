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

const states = [
    'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA',
    'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA',
    'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
    'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
    'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'
];

client.on("ready", () => {
    console.log(`Client user tag: ${client.user.tag}!`);
})

client.on("message", msg => {
    
    if (!msg.content.startsWith("!") || msg.author.bot) return;

    const args = msg.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    switch (command) {
        case "signup":
            if (msg.content === "!signup") {
                msg.reply(msg.author.id);
                let userDoc = db.collection('users').doc(msg.author.id).set({
                    id: msg.author.id
                });
            }
            break;
        case "location":
            if (!args.length) {
                return msg.reply("To use location command, please follow the paradigm:\n" +
                    "```!location <state (abbreviation)> <county (optional)>```\n Note: At this moment, only the US is supported.");
            } else if (!states.includes(args[0])) {
                return msg.reply('Looks like you may have entered the parameters wrong!\n Please follow the paradigm:\n' +
                    "```!location <state> <county (optional)>```\n Note: At this moment, only the US is supported.");
            } else {
                var o = "";
                for (i = 0; i < args.length; i++) {
                    if (i == 0) {
                        let updateState = db.collection('users').doc(msg.author.id).update({ state: args[0] });
                        o += "State: " + args[0];
                    } else if (i == 1) {
                        let updateCounty = db.collection('users').doc(msg.author.id).update({ county: args[1] });
                        o += ", County: " + args[1];
                    }
                }
                msg.reply(`Location added!\n${o}`);
            }
            break;
        case "botinfo":
            break;
        default:
            msg.reply('You must add a command for me to know what to do! Use !help to see a list of commands');
    }
})
client.login(process.env.BOT_TOKEN)