const Discord = require("discord.js");
const client = new Discord.Client({ disableEveryone: true });

// Firebase
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
let db = admin.firestore();
// Firebase End

function isUpperCase(str) {
    return str === str.toUpperCase();
}

// Discord
db.collection('env').doc('env').get().then(function (doc) {
    client.login(doc.data().token0).catch(err => {
        console.log("err3 ", err);
    });

    client.on("ready", () => {
        console.log(`Client user tag: ${client.user.id}!`);
        client.user.setActivity("alone, not by choice, but by law", { type: "Playing" });
    })
}).catch(function (err) {
    console.log(err);
});

function error(err) {
    var date = new Date();
    client.channels.get("696540781787217952").send(date + " Error: " + err);
};

client.on("message", msg => {
    if (msg.content == "so how was your day") {
        msg.reply("eh, not bad, u?");
    }
    if (msg.content == "so whatcha up to tomorrow?") {
        msg.reply('nothing much, just beating up some bitches');
    }
    
    if (!msg.content.startsWith("!")) return;

    if (msg.author.id == client.user.id && !msg.content != ("!activate")) {
        return;
    }

    const args = msg.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();
    const id = msg.author.id;
    const userDoc = db.collection('users').doc(id);

    switch (command) {
        case "signup":
            db.collection('users').doc(id).get().then(function (doc) {
                if (!doc.exists) {
                    db.collection('users').doc(id).set({
                        id: id
                    });
                    msg.reply('User created with id: ' + id);
                    client.users.get(id).send('Welcome to the CovidBot19 Community! Use the command `!help` to see a list of commands that you can run!\n' +
                    "This bot is still a WIP, so expect bugs and new features all at the same time!\nAnd don't forget, stay home and wash your hands for 20 seconds!");
                } else {
                    console.log("Users doc already exists, skipped writing.");
                    msg.reply("You're already signed up!");
                }
            });
            break;
        case "id":
            msg.reply(id);
            break;
        case "location":
            if (!args.length) {
                return msg.reply("To use the location command, please follow the paradigm:\n" +
                    "```!location <county (optional)>  <state (abbreviation)> ```Note: At this moment, only the US is supported.");
            } else {
                var o = "";
                const len = args.length;
                if (len == 3) {
                    var state = args[2];
                    var countyParts = args.slice(0, 2).toString();
                    var county = countyParts.replace(",", " ");
                } else {
                    var state = args[1];
                    var county = args[0];
                }
                
                for (i = 0; i < args.length; i++) {
                    if (i == 0) {
                        let updateState = db.collection('users').doc(msg.author.id).update({ state: state });
                        o += "State: " + state;
                    } else if (i == 1) {
                        let updateCounty = db.collection('users').doc(msg.author.id).update({ county: county });
                        o += ", County: " + county;
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
                    db.collection('users').doc(id).set({
                        countySubscription: true
                    }, { merge: true }).then(function () {
                        msg.reply('Subscribed to all county-level updates! These will be sent in your DM to prevent spam.\n Unsubscribe at any time using the command ```!unsubscribe county```');
                    });
                    break;
                case "state":
                    db.collection('users').doc(id).set({
                        stateSubscription: true
                    }, { merge: true }).then(function () {
                        msg.reply('Subscribed to all state-level updates! These will be sent in your DM to prevent spam.\n Unsubscribe at any time using the command ```!unsubscribe state```');
                    });
                    break;
                case "country":
                    db.collection('users').doc(id).set({
                        countrySubscription: true
                    }, { merge: true }).then(function () {
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
                    db.collection('users').doc(id).set({
                        countySubscription: false
                    }, { merge: true }).then(function () {
                        msg.reply('Unsubcribed from all county-level updates.\n Subscribe at any time using the command ```!subscribe county```');
                    });
                    break;
                case "state":
                    db.collection('users').doc(id).set({
                        stateSubscription: false
                    }, { merge: true }).then(function () {
                        msg.reply('Unsubcribed from all state-level updates.\n Subscribe at any time using the command ```!subscribe state```');
                    });
                    break;
                case "country":
                    db.collection('users').doc(id).set({
                        countrySubscription: false
                    }, { merge: true }).then(function () {
                        msg.reply('Unsubcribed from all country-level updates.\n Subscribe at any time using the command ```!subscribe country```');
                    });
                    break;
            }
            break;
        case "watchlist":
            if (!args.length) {
                return msg.reply("To use the watchlist command, please follow the paradigm:\n" +
                    "```!watchlist <command> <county (optional)> <state (abbreviation)>```Note: At this moment, only the US is supported.");
            }
            switch (args[0]) {
                case "view":
                    userDoc.get().then(function (doc) {
                        if (!doc.exists) {
                            return msg.reply("Uh oh! Looks like you don't have an account! Create one using !signup and then retry this command.");
                        } else {
                            var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;
                            if (!watchlist) {
                                return msg.reply("Hm, looks like you don't have any locations in your watchlist! Run the command !watchlist add <args> to add something now!");
                            }
                            var watchlistString = "";
                            for (i = 0; i < watchlist.length; i++) {
                                if ((i == (watchlist.length - 1)) && (watchlist.length > 1)) {
                                    watchlistString += "and " + watchlist[i];
                                } else if (watchlist.length > 2) {
                                    watchlistString += watchlist[i] + ", ";
                                } else if (watchlist.length == 2) {
                                    watchlistString += watchlist[i] + " ";
                                } else if (watchlist.length == 1) {
                                    watchlistString = watchlist[0];
                                } else {
                                    error("Error occurred, should be impossible????");
                                    console.log(watchlist);
                                }
                            }
                            if (watchlistString.length == 0) {
                                return msg.reply("Hm, looks like you don't have any locations in your watchlist! Run the command !watchlist add <args> to add something now!");
                            } else {
                                msg.reply("Your watchlist: " + watchlistString);
                            }
                        }
                    }).catch(function (err) {
                        console.log(err);
                        return msg.reply("Error getting watchlist data, seems like a problem on our end. Sorry!");
                    });
                    break;
                case "add":
                    var location = args.slice(1, args.length).toString();
                    location = location.replace(",", " ");
                    if (location.split(",").length == 2) {
                        location = location.replace(",", " ");
                    }

                    var lastArg = location[location.length - 1];
                    if (!isUpperCase(lastArg)) {
                        error("State isn't last/uppercase?");
                        return msg.reply("Looks like you may have typed the command in wrong! Check the full command " +
                            "(!help for how a list of command descriptions) to verify that there are no mistakes and then try again.");
                    }

                    userDoc.get().then(function (doc) {
                        if (!doc.exists) {
                            return msg.reply("Uh oh! Looks like you don't have an account! Create one using !signup and then retry this command.");
                        } else {
                            var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;
                            if (!watchlist) {
                                error("Error occurred - watchlist undefined (shouldn't matter, creating now)");

                                if (location.length == 3) {
                                    var watchlist = [location[0] + " " + location[1], location[2]];
                                } else {
                                    var watchlist = [location];
                                }

                                userDoc.set({
                                    watchlist: watchlist
                                }, { merge: true }).then(function () {
                                    msg.reply("Added " + location + " to your watchlist!");
                                    return msg.reply("Your new watchlist: " + location);
                                });
                            } else {
                                if (watchlist.includes(location)) {
                                    msg.reply(location + " is already in your watchlist, skipped adding.");
                                    return;
                                }  else {
                                    watchlist.push(location);

                                    var watchlistString = "";
                                    for (i = 0; i < watchlist.length; i++) {
                                        if ((i == (watchlist.length - 1)) && (watchlist.length > 1)) {
                                            watchlistString += "and " + watchlist[i];
                                        } else if (watchlist.length > 2) {
                                            watchlistString += watchlist[i] + ", ";
                                        } else if (watchlist.length == 2) {
                                            watchlistString += watchlist[i] + " ";
                                        } else {
                                            watchlistString = location;
                                        }
                                    }

                                    userDoc.update({
                                        watchlist: watchlist
                                    }).then(function () {
                                        msg.reply("Added " + location + " to your watchlist!");
                                        return msg.reply("Your new watchlist: " + watchlistString);
                                    });
                                }
                            }
                        }
                    }).catch(function (err) {
                        error(err);
                        return msg.reply("Oh no! Watchlist add failed! Check the full command (!watchlist for a list of arguments) to make sure you didn't make any mistakes!");
                    });
                    break;
                case "remove":
                    var location = args.slice(1, args.length).toString();
                    location = location.replace(",", " ");
                    if (location.split(",").length == 2) {
                        location = location.replace(",", " ");
                    }

                    var lastArg = location[location.length - 1];
                    if (!isUpperCase(lastArg)) {
                        error("State isn't last/uppercase?");
                        return msg.reply("Looks like you may have typed the command in wrong! Check the full command " +
                            "(!help for how a list of command descriptions) to verify that there are no mistakes and then try again.");
                    }

                    userDoc.get().then(function (doc) {
                        if (!doc.exists) {
                            return msg.reply("Uh oh! Looks like you don't have an account! Create one using !signup and then retry this command.");
                        } else {
                            var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;
                            if (!watchlist) {
                                return msg.reply("Hm, looks like you don't have any locations in your watchlist! Run the command !watchlist add <args> to add something now!");
                            } else {
                                if (watchlist.includes(location)) {
                                    var removeIndex = watchlist.indexOf(location);
                                    var newWatchlist = watchlist.splice(removeIndex, 1);

                                    var watchlistString = "";
                                    for (i = 0; i < watchlist.length; i++) {
                                        if ((i == (watchlist.length - 1)) && (watchlist.length > 1)) {
                                            watchlistString += "and " + watchlist[i];
                                        } else if (watchlist.length > 2) {
                                            watchlistString += watchlist[i] + ", ";
                                        } else if (watchlist.length == 2) {
                                            watchlistString += watchlist[i] + " ";
                                        } else if (watchlist.length == 1) {
                                            watchlistString = watchlist[0];
                                        } else {
                                            error("Error occurred, should be impossible????");
                                            console.log(watchlist);
                                        }
                                    }

                                    userDoc.update({
                                        watchlist: watchlist
                                    }).then(function () {
                                        msg.reply("Removed " + location + " from your watchlist!");
                                        if (watchlist.length >= 1) {
                                            return msg.reply("Your new watchlist: " + watchlistString);
                                        } else {
                                            return msg.reply("Your watchlist is now empty!");
                                       }
                                     });
                                } else {
                                    return msg.reply("Hm, looks like you don't have " + location + " in your watchlist!");
                                }
                            }
                        }
                    }).catch(function (err) {
                        error(err);
                        return msg.reply("Oh no! Watchlist add failed! Check the full command (!watchlist for a list of arguments) to make sure you didn't make any mistakes!");
                    });
                    break;
                case "clear":
                    userDoc.get().then(function (doc) {
                        if (!doc.exists) {
                            return msg.reply("Uh oh! Looks like you don't have an account! Create one using !signup.");
                        } else {
                            var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;
                            if (watchlist != "") {
                                userDoc.update({
                                    watchlist: []
                                }).then(function () {
                                    return msg.reply("Successfully cleared your watchlist!");
                                });
                            } else {
                                return msg.reply("Your watchlist is already empty!");
                            }
                        }
                    }).catch(function (err) {
                        error(err);
                        return msg.reply("Oh no! Watchlist clear failed! Check the command to make sure you didn't make any mistakes!");
                    });
                    break;
                default:
                    return msg.reply("I couldn't recognize that command, make sure you typed it in correctly!");
            }
            break;
        case "activate":
            if (msg.channel.id != "696894398293737512") return;
            msg.reply("Activated. Now starting database query for update-enabled users.");

            db.collection('users').get().then(async function (querySnapshot) {
                querySnapshot.forEach(async function (doc) {
                    var location = (doc.data().location) ? doc.data().watchlist : null;
                    if (location) {
                        await msg.channel.send("!botcases " + location + " " + doc.id);
                    }

                    var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;
                    if (watchlist) {
                        const watchlistLoop = async _ => {
                            for (i = 0; i < watchlist.length; i++) {
                                var token = doc.id + Math.floor(100000 + Math.random() * 999999);
                                await msg.channel.send("!botcases " + watchlist[i] + " " + token);

                                client.on('message', function (message) {
                                    if (message.author.id == "692117206108209253" && message.channel.id == "696894398293737512" && message.content.includes(token)) {
                                        var data = message.content.replace(token + " ", " ").toString();
                                        var matches = data.match(/\d+/g);
                                        var cases = matches[0];
                                        var deaths = matches[1];

                                        return message.channel.send("Cases: " + cases + " Deaths: " + deaths);
                                    }
                                });
                            }
                        }
                        watchlistLoop();
                    }
                });
            });

            break;
        case "help":
            const embed = new Discord.RichEmbed()
                .setTitle("Command List")
                .setColor('#C70039')
                .setThumbnail("https://www.genengnews.com/wp-content/uploads/2020/02/Getty_185760322_Coronavirus.jpg")
                .setURL("https://covidbot19.web.app")
                .addField("Signup",
                    "`!signup (no args)` - saves your Discord account so you can access even better features like the watchlist and subscriptions.\n"
                )
                .addField("ID",
                    "`!id (no args)` - retrieves your Discord ID; useful on our website to connect / sign in to a Discord account.\n"
                )
                .addField("Location",
                    "`!location <county (optional)> <state (abbreviation)>` - saves your location in case you want to see local data later.\n"
                )
                .addField("Subscribe",
                    "`!subscribe <level (county, state, country)>` - subscribes to the specified level of data, allowing direct messages from the bot for new cases." +
                    "Note: this command is not for specific data, it only subscribes to the level of data regardless of location.\n"
                )
                .addField("Unsubscribe",
                    "`!unsubscribe <level (county, state, country)>` - subscribes to the specified level of data, allowing direct messages from the bot for new cases.\n"
                )
                .addField("Watchlist",
                    "`!watchlist <view (no args)/add/remove/clear (no args)> <county (optional)> <state (abbreviation)>` - adds a specific location to your watchlist.\n"
                )
                .addField("Cases",
                    "`!cases <level (county, state, country)> <chart (optional)>` - sends number of cases at the specified level of data plus an optional chart modelling historic data.\n"
                )
                .setFooter('Data Source: Arcgis');
            msg.channel.send({ embed });
            break;
        case "":
            msg.reply('You must add a command for me to know what to do! Use !help to see a list of commands');
            break;
        default:
            break;
    }
})
// Discord End
