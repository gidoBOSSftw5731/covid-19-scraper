require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client()

var firebase = require("firebase");
firebase.initializeApp({
    apiKey: "AIzaSyDMq0mi1Se1KXRyqaIwVZnv1csYshtrgu0",
    authDomain: "coronavirusbot19.firebaseapp.com",
    databaseURL: "https://coronavirusbot19.firebaseio.com",
    projectId: "coronavirusbot19",
    storageBucket: "coronavirusbot19.appspot.com",
    messagingSenderId: "814043085257",
    appId: "1:814043085257:web:d4151d18cb5d4a16ca1018",
    measurementId: "G-4TKZD7504L"
});

let db = firebase.firestore();

// var admin = require("firebase-admin");

// var serviceAccount = require("./coronavirusbot19-firebase-adminsdk-sckiv-6ca1e54162.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://coronavirusbot19.firebaseio.com"
// });

// let db = admin.firestore();

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
            var helloWorld = firebase.functions().httpsCallable('helloWorld');
            helloWorld();
            var addUser = firebase.functions().httpsCallable('addUser');
            addUser({ text: 3 }).catch(function (error) {
                var code = error.code;
                var message = error.message;
                var details = error.details;
                console.log(code.toString(), message.toString(), details);
            });
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
        case "subscribe":
            msg.reply('Subscribed! (not really)');
            break;
        case "cases":
            var docRef = db.collection("test").doc("test");
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    msg.reply("Cases: " + doc.data().confirmed.toString() + "\n Deaths: " + doc.data().deaths.toString());
                } else {
                    msg.reply("No such document!");
                }
            }).catch(function (error) {
                msg.reply("Error getting document:", error);
            });
            break;
        case "help":
            const help = new Discord.MessageEmbed()
                .setColor('#C70039')
                .setTitle('Command List')
                .setURL('https://covidbot19.web.app/')
                .setThumbnail('https://www.genengnews.com/wp-content/uploads/2020/02/Getty_185760322_Coronavirus.jpg')
                .addFields(
                    {name: 'Commands', value: "!signup (No args) - saves your Discord account so you can later save your location and opt-in for updates on cases in your area.\n" +
                            "!location <state (abbreviation)> <county (optional)> - saves your location in case you want to see local data later.\n" +
                            "!subscribe <level (county, state, country)> - subscribes to the specified level of data, allowing direct messages from the bot for new cases.\n" +
                            "!cases <level (county, state, country)> <chart (optional)> - sends number of cases at the specified level of data plus an optional chart modelling historic data.\n"},
                )
                .setTimestamp()
                .setFooter('Data Source: Arcgis');
            msg.reply(help);
            break;
        case "":
            msg.reply('You must add a command for me to know what to do! Use !help to see a list of commands');
            break;
        default:
            break;
    }
})
client.login(process.env.BOT_TOKEN)