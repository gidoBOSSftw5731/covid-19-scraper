require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client()
var protobuf = require('protocol-buffers')
var fs = require('fs');
var pb = protobuf(fs.readFileSync('./api.proto'))
const request = require('request');

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

var admin = require("firebase-admin");

var serviceAccount = require("./coronavirusbot19-firebase-adminsdk-sckiv-6ca1e54162.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://coronavirusbot19.firebaseio.com"
});

const httpAPI = "https://buttstuff.ops-netman.net"

let db = admin.firestore();

var state_convert = JSON.parse(fs.readFileSync('stateConversions.json', 'utf8'));

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

const get_data = async url => {
   res = request(url, { json: true }, function (err, resp, body) {
    console.log(body.explanation)
    return resp.body
   })
   return res
};

client.on("message", msg => {
    //easter eggs
    if (msg.content == "so how was your day") {
        msg.reply("eh, not bad, u?");
    }
    if (msg.content == "so whatcha up to tomorrow?") {
        msg.reply('nothing much, just beating up some bitches');
    }
    
    if (!msg.content.startsWith("!") || msg.author.bot) return;

    const args = msg.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();
    const id = msg.author.id;

    switch (command) {
        case "signup":
            db.collection('users').doc(id).set({
                id: id
            }, { merge: true });
            msg.reply('User created with id: ' + id)
            break;
        case "location":
            if (!args.length) {
                return msg.reply("To use the location command, please follow the paradigm:\n" +
                    "```!location <state (abbreviation)> <county (optional)>```Note: At this moment, only the US is supported.");
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
        case "subscribe": // this should add the user to a table in firestore
            if (!args.length) {
                return msg.reply("To use the subscribe command, please follow the paradigm:\n" +
                    "```!subscribe <level (county, state, country)>```Note: At this moment, only the US is supported.");
            }
            switch (args[0]) {
                case "county":
                    db.collection('subscriptions').doc('county').update({
                        users: firebase.firestore.FieldValue.arrayUnion(id)
                    }).then(function () {
                        msg.reply('Subscribed to all county-level updates! These will be sent in your DM to prevent spam.\n Unsubscribe at any time using the command ```!unsubscribe county```');
                    });
                    break;
                case "state":
                    db.collection('subscriptions').doc('state').update({
                        users: firebase.firestore.FieldValue.arrayUnion(id)
                    }).then(function () {
                        msg.reply('Subscribed to all state-level updates! These will be sent in your DM to prevent spam.\n Unsubscribe at any time using the command ```!unsubscribe state```');
                    });
                    break;
                case "country":
                    db.collection('subscriptions').doc('country').update({
                        users: firebase.firestore.FieldValue.arrayUnion(id)
                    }).then(function () {
                        msg.reply('Subscribed to all country-level updates! These will be sent in your DM to prevent spam.\n Unsubscribe at any time using the command ```!unsubscribe country```');
                    });
                    break;
            }
            break;
        case "unsubscribe": 
            if (!args.length) {
                return msg.reply("To use the unsubscribe command, please follow the paradigm:\n" +
                    "```!unsubscribe <level (county, state, country)>```Note: At this moment, only the US is supported.");
            }
            switch (args[0]) {
                case "county":
                    db.collection('subscriptions').doc('county').update({
                        users: firebase.firestore.FieldValue.arrayRemove(id)
                    }).then(function () {
                        msg.reply('Unsubcribed from all county-level updates.\n Subscribe at any time using the command ```!subscribe county```');
                    });
                    break;
                case "state":
                    db.collection('subscriptions').doc('state').update({
                        users: firebase.firestore.FieldValue.arrayRemove(id)
                    }).then(function () {
                        msg.reply('Unsubcribed from all state-level updates.\n Subscribe at any time using the command ```!subscribe state```');
                    });
                    break;
                case "country":
                    db.collection('subscriptions').doc('country').update({
                        users: firebase.firestore.FieldValue.arrayRemove(id)
                    }).then(function () {
                        msg.reply('Unsubcribed from all country-level updates.\n Subscribe at any time using the command ```!subscribe country```');
                    });
                    break;
            }
            break;
        case "cases":
            if (!args.length) {
                return msg.reply("To use the cases command, please follow the paradigm:\n" +
                    "```!cases <level (county, state, country)> <chart (optional)>```Note: At this moment, only the US is supported.");
            }

            var county = args[0];
            var state = args[1];
            var country = "US" // someone will fix this later
            
            if (state_convert[state.toUpperCase()] != null) {
                state = state_convert[state.toUpperCase()];
            }

            if (county == "") {
                ext = "/"+country + "/" + state
            } else {
                ext = "/currentinfo/"+country + "/" + state + "/" + county
            }

            get_data(httpAPI + ext).then(function (text) {
                
                //console.log(text)
                result = pb.AreaInfo.decode(text)
                console.log(result)
                var confirmed = result.ConfirmedCases;
                var deaths = result.Deaths;
                var update = new Date(result.UnixTimeOfRequest).toISOString();
                msg.reply('Confirmed: ' + confirmed + ', Deaths: ' + deaths + ' in ' + county + ' as of ' + update);
            }).catch(function (error) {
                var code = error.code;
                var message = error.message;
                var details = error.details;
                console.error('There was an error when calling the Cloud Function', error);
                console.log('There was an error when calling the Cloud Function:\n\nError Code: '
                    + code + '\nError Message:' + message + '\nError Details:' + details);
            });
            break;
        case "help":
            const help = new Discord.MessageEmbed()
                .setColor('#C70039')
                .setTitle('Command List')
                .setURL('https://covidbot19.web.app/')
                .setThumbnail('https://www.genengnews.com/wp-content/uploads/2020/02/Getty_185760322_Coronavirus.jpg')
                .addFields({
                    name: 'Commands',
                    value: "!signup (No args) - saves your Discord account so you can later save your location and opt-in for updates on cases in your area.\n\n" +
                        "!location <state (abbreviation)> <county (optional)> - saves your location in case you want to see local data later.\n\n" +
                        "!subscribe <level (county, state, country)> - subscribes to the specified level of data, allowing direct messages from the bot for new cases.\n\n" +
                        "!unsubscribe <level (county, state, country)> - subscribes to the specified level of data, allowing direct messages from the bot for new cases. Note: does not delete your\n\n" +
                        "!cases <level (county, state, country)> <chart (optional)> - sends number of cases at the specified level of data plus an optional chart modelling historic data.\n\n"
                })
                .setTimestamp()
                .setFooter('Data Source: Arcgis')
            msg.reply(help);
            break;
        case "test":
            const AGFileURL = "https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson";
            var sendNotification = firebase.functions().httpsCallable('arcgisgetter');
            sendNotification(AGFileURL).then(function (result) {
                msg.reply(result);
            }).catch(function (error) {
                var code = error.code;
                var message = error.message;
                var details = error.details;
                console.error('There was an error when calling the Cloud Function', error);
                console.log('There was an error when calling the Cloud Function:\n\nError Code: '
                    + code + '\nError Message:' + message + '\nError Details:' + details);
            });
            break;
        case "":
            msg.reply('You must add a command for me to know what to do! Use !help to see a list of commands');
            break;
        default:
            break;
    }
})
client.login(process.env.BOT_TOKEN)