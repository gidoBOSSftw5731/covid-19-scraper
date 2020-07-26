'use strict';

const Discord = require("discord.js");
const client = new Discord.Client({ disableEveryone: true });

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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

function isUpperCase(str) {
    return str === str.toUpperCase();
}

db.collection('env').doc('env').get().then(function (doc) {
    client.login(doc.data().token0).catch(err => {
        error(err);
    });

    client.on("ready", function readysetgo() {
        log(`Client user tag: ${client.user.id}!`);
        client.user.setActivity("alone | !help", { type: "Playing" });

        client.channels.get("696894398293737512").send("!test");

        return client.removeListener('on', readysetgo);
    })
}).catch(function (err) {
    error(err);
});

function error(err) {
    var date = new Date();
    client.channels.get("696540781787217952").send(date + " " + err);

    console.log(date, err);
};

function log(message) {
    var date = new Date();
    client.channels.get("696540781787217952").send(date + " " + message);
};

client.setMaxListeners(15);

var stateNumbers = ['WV','FL','IL','MN','MD','RI','ID','NH','NC','VT','CT','DE','NM','CA','NJ','WI','OR','NE','PA','WA','LA','GA','AL','UT','OH','TX','CO','SC','OK','TN','WY','HI','ND','KY','VI','MP','GU','ME','NY','NV','AK','AS','MI','AR','MS','MO','MT','KS','IN','PR','SD','MA','VA','DC','IA']

client.on("message", msg => {
    if (msg.content == "so how was your day") {
        msg.reply("eh, not bad, u?");
    }
    if (msg.content == "so whatcha up to tomorrow?") {
        msg.reply('nothing much, just beating up some bitches');
    }
    if (msg.content == "the bot is broken") {
        msg.reply("no i'm not")
    }

    if (!msg.content.startsWith("!")) return;

    if (msg.content == ("!activate") && msg.channel.id == "696894398293737512") {
        log("---------------------------");
        log("Activation message received.");
    } else if (msg.author.id == client.user.id && msg.content != "!test") {
        return;
    }

    const args = msg.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();
    const id = msg.author.id;
    const users = db.collection('users');
    const userDoc = users.doc(id);

    switch (command) {
        case "signup":
            userDoc.get().then(function (doc) {
                if (!doc.exists) {
                    userDoc.set({
                        id: id
                    });
                    msg.reply('User created with id: ' + id);
                    client.users.get(id).send('Welcome to the CovidBot19 Community! Use the command `!help` to see a list of commands that you can run!\n' +
                    "This bot is still a WIP, so expect bugs and new features all at the same time!\nAnd don't forget, stay home and wash your hands for 20 seconds!");
                } else {
                    log("Users doc already exists, skipped writing.");
                    msg.reply("You're already signed up!");
                }
            }).catch(function (err) {
                error(err);
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
                } else if (len == 2) {
                    var state = args[1];
                    var county = args[0];
                } else if (args[0] == "clear") {
                    userDoc.update({
                        location: firebase.firestore.FieldValue.delete()
                    });
                    return msg.reply("Your location has been cleared!");
                }
                
                for (i = 0; i < args.length; i++) {
                    if (i == 0) {
                        let updateState = userDoc.update({ state: state });
                        o += "State: " + state;
                    } else if (i == 1) {
                        let updateCounty = userDoc.update({ county: county });
                        o += ", County: " + county;
                    }
                }
                msg.reply(`Location added!\n${o}`);
            }
            break;
        case "subscribe": // this could maybe just add the user to a table in firestore?
            if (!args.length) {
                return msg.reply("To use the subscribe command, please follow the paradigm:\n" +
                    "```!subscribe <level (county, state, country)>```Note: At this moment, only the US is supported.");
            }
            switch (args[0]) {
                case "county":
                    userDoc.set({
                        countySubscription: true
                    }, { merge: true }).then(function () {
                        msg.reply('Subscribed to all county-level updates! These will be sent in your DM to prevent spam.\n Unsubscribe at any time using the command ```!unsubscribe county```');
                    }).catch(function (err) {
                        error(err);
                    });
                    break;
                case "state":
                    userDoc.set({
                        stateSubscription: true
                    }, { merge: true }).then(function () {
                        msg.reply('Subscribed to all state-level updates! These will be sent in your DM to prevent spam.\n Unsubscribe at any time using the command ```!unsubscribe state```');
                    }).catch(function (err) {
                        error(err);
                    });
                    break;
                case "country":
                    userDoc.set({
                        countrySubscription: true
                    }, { merge: true }).then(function () {
                        msg.reply('Subscribed to all country-level updates! These will be sent in your DM to prevent spam.\n Unsubscribe at any time using the command ```!unsubscribe country```');
                    }).catch(function (err) {
                        error(err);
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
                    userDoc.set({
                        countySubscription: false
                    }, { merge: true }).then(function () {
                        msg.reply('Unsubcribed from all county-level updates.\n Subscribe at any time using the command ```!subscribe county```');
                    }).catch(function (err) {
                        error(err);
                    });
                    break;
                case "state":
                    userDoc.set({
                        stateSubscription: false
                    }, { merge: true }).then(function () {
                        msg.reply('Unsubcribed from all state-level updates.\n Subscribe at any time using the command ```!subscribe state```');
                    }).catch(function (err) {
                        error(err);
                    });
                    break;
                case "country":
                    userDoc.set({
                        countrySubscription: false
                    }, { merge: true }).then(function () {
                        msg.reply('Unsubcribed from all country-level updates.\n Subscribe at any time using the command ```!subscribe country```');
                    }).catch(function (err) {
                        error(err);
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
                                    log(watchlist);
                                }
                            }
                            if (watchlistString.length == 0) {
                                return msg.reply("Hm, looks like you don't have any locations in your watchlist! Run the command !watchlist add <args> to add something now!");
                            } else {
                                msg.reply("Your watchlist: " + watchlistString);
                            }
                        }
                    }).catch(function (err) {
                        error(err);
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
                        return msg.reply("Looks like you may have typed the command in wrong! Check the full command " +
                            "(!help for how a list of command descriptions) to verify that there are no mistakes and then try again.");
                    }

                    userDoc.get().then(function (doc) {
                        if (!doc.exists) {
                            return msg.reply("Uh oh! Looks like you don't have an account! Create one using !signup and then retry this command.");
                        } else {
                            var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;
                            if (!watchlist) {
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
                                }).catch(function (err) {
                                    error(err);
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
                                    }).catch(function (err) {
                                        error(err);
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
                                            log(watchlist);
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
                                    }).catch(function (err) {
                                        error(err);
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
                                }).catch(function (err) {
                                    error(err);
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
        case "timeset":
            if (!args.length) {
                return msg.reply("To use the timeset command, please follow the paradigm:\n" +
                    "```!timeset <action (add/remove/view (no args)/timezone (takes your timezone or help))> <subscription method (location, subscribe, or watchlist)> <time (Hour + AM/PM)>```Note: You can only set full hour intervals.");
            }

            var action = args[0];
            if (action != "add" && action != "remove" && action != "view" && action != "timezone") {
                return msg.reply("Oops! Looks like you entered an invalid command! !timeset supports add, remove, view, and timezone.");
            }
            args.shift();

            if (action == "view") {
                var commands = ["location", "subscribe", "watchlist"];
                if (!commands.includes(args[0])) {
                    return msg.reply("Please add a valid subscription method (location, subscribe, or watchlist) to view its timeset list.");
                } else if (args.length != 1) {
                    return msg.reply("The timeset view command only takes one category parameter (location, subscribe, or watchlist). Please do not add any extra parameters.");
                } else {
                    userDoc.get().then(function (doc) {
                        var commandTimes = doc.data().timesetCommands;
                        if (!commandTimes || !commandTimes[args[0]] || commandTimes[args[0]].length < 1) {
                            return msg.reply("Timeset list is empty for " + args[0]);
                        } else {
                            var times = commandTimes[args[0]];
                            return msg.reply(times.toString().replace(/,/g, ", "));
                        }
                    }).catch(function (err) {
                        error(err);
                        return msg.reply("Looks like an error occurred. This is most likely not your fault, so please contact a developer on our server (Command: !discord) or wait for an update.");
                    });
                }
            } else if (action == "timezone") {
                var timezone = args[0].toUpperCase();
                switch (timezone) {
                    case "EDT": case "EST": case "CDT": case "MDT": case "MST": case "PDT": case "PST": case "AKDT": case "HST":
                        userDoc.update({
                            tz: timezone
                        }).then(function () {
                            msg.reply("Your new timezone is " + timezone + "!");
                            return log("User " + id + " given timezone " + timezone + "!");
                        }).catch(function (err) {
                            error(err);
                            msg.reply("Sorry, an error occurred while trying to update your timezone. Try again later!");
                            return e++;
                        });
                        break;
                    case "HELP":
                        return msg.reply("Valid timezones: EDT, CDT, MDT, MST, PDT, AKDT, and HST.\n Go to https://bit.ly/us-timezones to see a list of the accepted timezones.");
                    default:
                        return msg.reply("Please enter a valid timezone or 'help'!");
                }
            } else {
                var commands = ["location", "subscribe", "watchlist"];
                if (!commands.includes(args[0])) {
                    return msg.reply("Oops! Looks like you entered an invalid usage! !timeset supports location, subscribe, and watchlist.");
                }
                var timesetCommand = args[0];

                if (args.length == 1) {
                    return msg.reply("Please enter a time!");
                } else if (args.length == 2) {
                    var time = (args[1]).toUpperCase();
                } else if (args.length == 3) {
                    var time = (args[1] + args[2]).toUpperCase();
                } else {
                    return msg.reply("Oops! Looks like you entered the command wrong! Example: `!timeset add watchlist 4pm`");
                }

                if (!/\b((1[0-2]|0?[1-9])\s?([AaPp][Mm]))/g.test(time)) {
                    return msg.reply("Oops! Looks like you formatted the time wrong! Examples: 4pm, 4PM, 4 pm, 4 PM");
                }

                userDoc.get().then(function (doc) {
                    var commandTimes = doc.data().timesetCommands;
                    if (!commandTimes || !commandTimes[timesetCommand]) {
                        var times = [];
                    } else {
                        var times = commandTimes[timesetCommand];
                    }
                    if (action == "add") {
                        if (times.includes(time)) {
                            return msg.reply("This time is already in your list for " + timesetCommand + "!");
                        } else if (times.length == "3") {
                            return msg.reply("Looks like you already have three times for " + timesetCommand + "! Use !timeset remove <args> to open up space for other times.");
                        } else {
                            times.push(time);
                        }
                    } else if (action == "remove") {
                        if (!times.includes(time)) {
                            return msg.reply("This time is not in your list for " + timesetCommand + "!");
                        } else {
                            var t = times.indexOf(time);
                            times.splice(t, ++t);
                        }
                    }

                    switch (timesetCommand) {
                        case "location":
                            eval(`userDoc.update({ 'timesetCommands.location': times }).catch(function (err) { error(err); });`);
                            break;
                        case "watchlist":
                            eval(`userDoc.update({ 'timesetCommands.watchlist': times }).catch(function (err) { error(err); });`);
                            break;
                        case "subscribe":
                            eval(`userDoc.update({ 'timesetCommands.subscribe': times }).catch(function (err) { error(err); });`);
                            break;
                    }

                    if (action == "add") {
                        var conj = " to ";
                        var past = "ed "
                    } else {
                        var conj = " from ";
                        var past = "d "
                    }
                    return msg.reply("Successfully " + action + past + time + conj + "your " + timesetCommand + " list!\nNew " + timesetCommand + " timeset list: " + times.toString().replace(/,/g, ", "));
                }).catch(function (err) {
                    error(err);
                    return msg.reply("Looks like an error occurred. This is most likely not your fault, so please contact a developer on our server (Command: !discord) or wait for an update.");
                });
            }
            break;
        case "activate":
            if (msg.channel.id != "696894398293737512") return msg.reply("no u");
            msg.reply("Activated! Now starting database query for update-enabled users.");

            var locations = [];
            var locationsMatches = [];

            var pass = 0;
            var e = 0;

            function doWorst() {
                msg.channel.send('!worst');
                client.on('message', function listentome0(message) {
                    if (message.author.id == "692117206108209253" && message.embeds[0] != null && message.channel.id == "696894398293737512") {
                        var dwUsersNo = [];
                        var dwUsersYes = [];

                        users.where("countySubscription", "==", true).get().then(function (querySnapshot) {
                            var l = 0;
                            querySnapshot.forEach(function (doc) {
                                l++;

                                var times = (doc.data().timesetCommands) ? doc.data().timesetCommands : null;
                                var subscribeTimes = (times && times.subscribe) ? times.subscribe.toString().split(",") : null;
                                var timezone = (doc.data().tz) ? doc.data().tz : null;

                                if (!subscribeTimes) {
                                    dwUsersNo.push(doc.id);
                                } else {
                                    switch (timezone) {
                                        case "EDT", "EST", null:
                                            var hotspot = "New_York";
                                            break;
                                        case "CDT":
                                            var hotspot = "Chicago";
                                            break;
                                        case "MDT":
                                            var hotspot = "Salt_Lake_City";
                                            break;
                                        case "MST":
                                            var hotspot = "Phoenix";
                                            break;
                                        case "PDT":
                                            var hotspot = "Los_Angeles";
                                            break;
                                        case "AKDT":
                                            var hotspot = "Anchorage";
                                            break;
                                        case "HST":
                                            var hotspot = "Honolulu";
                                            break;
                                        default:
                                            var hotspot = "New_York";
                                    }

                                    var localTime = new Date().toLocaleString("en-US", { timeZone: "America/" + hotspot });
                                    localTime = new Date(localTime);
                                    var lt = localTime.toLocaleString();
                                    var hour = lt.slice(lt.indexOf(", ") + 2, lt.indexOf(":")) + lt.slice(-2);

                                    if (!subscribeTimes.includes(hour)) {
                                        dwUsersNo.push(doc.id);
                                    } else {
                                        dwUsersYes.push(doc.id);
                                        message.embeds.forEach((embed) => {
                                            client.users.get(doc.id).send({
                                                embed: embed
                                            });
                                        });
                                    }
                                }

                                if (l == querySnapshot.size) {
                                    log("---------------------------");
                                    pass++;
                                    client.removeListener('message', listentome0);
                                    return doCountry();
                                }
                            });
                        }).catch(function (err) {
                            error(err);
                            e++;
                            return client.removeListener('message', listentome0);
                        });
                    }
                });
            }

            function doCountry() {
                setTimeout(function () {
                    msg.channel.send('!cases');
                }, 1000);

                var retry = setTimeout(function () {
                    msg.channel.send('!cases');
                }, 5000);

                var o = true;
                client.on('message', function listentome1(message) {
                    if (message.author.id == "692117206108209253" && message.content.includes("The country of US") && message.channel.id == "696894398293737512" && o) {
                        clearTimeout(retry);

                        o = false;

                        var matches = message.content.match(/\d+/g);
                        var data = [matches[0], matches[1]];

                        var d = new Date();

                        var month = (d.getMonth() + 1 < 10) ? ("0" + (d.getMonth() + 1).toString()) : (d.getMonth() + 1).toString();
                        var day = (d.getDate() + 1 < 10) ? ("0" + (d.getDate() + 1).toString()) : (d.getDate() + 1).toString();
                        var hour = (d.getHours() < 10) ? ("0" + (d.getHours().toString())) : d.getHours().toString();

                        var addr = ("US." + d.getFullYear().toString() + month + day + hour).toString();

                        var dcUsersNo = [];
                        var dcUsersYes = [];

                        users.where("countrySubscription", "==", true).get().then(function (querySnapshot) {
                            var l = 0;
                            querySnapshot.forEach(function (doc) {
                                l++;

                                var times = (doc.data().timesetCommands) ? doc.data().timesetCommands : null;
                                var subscribeTimes = (times && times.subscribe) ? times.subscribe.toString().split(",") : null;
                                var timezone = (doc.data().tz) ? doc.data().tz : null;

                                if (!subscribeTimes) {
                                    dcUsersNo.push(doc.id);
                                } else {
                                    switch (timezone) {
                                        case "EDT", "EST", null:
                                            var hotspot = "New_York";
                                            break;
                                        case "CDT":
                                            var hotspot = "Chicago";
                                            break;
                                        case "MDT":
                                            var hotspot = "Salt_Lake_City";
                                            break;
                                        case "MST":
                                            var hotspot = "Phoenix";
                                            break;
                                        case "PDT":
                                            var hotspot = "Los_Angeles";
                                            break;
                                        case "AKDT":
                                            var hotspot = "Anchorage";
                                            break;
                                        case "HST":
                                            var hotspot = "Honolulu";
                                            break;
                                        default:
                                            var hotspot = "New_York";
                                    }

                                    var localTime = new Date().toLocaleString("en-US", { timeZone: "America/" + hotspot });
                                    localTime = new Date(localTime);
                                    var lt = localTime.toLocaleString();
                                    var hour = lt.slice(lt.indexOf(", ") + 2, lt.indexOf(":")) + lt.slice(-2);

                                    if (!subscribeTimes.includes(hour)) {
                                        dcUsersNo.push(doc.id);
                                    } else {
                                        dcUsersYes.push(doc.id);
                                        eval("users.doc('" + doc.id + "').update({'" + addr + "': '" + data + "'});");

                                        client.users.get(doc.id).send(message.content);
                                    }
                                }

                                if (l == querySnapshot.size) {
                                    log("---------------------------");
                                    pass++;
                                    client.removeListener('message', listentome1);
                                    return doLocation();
                                }
                            });
                        }).catch(function (err) {
                            error(err);
                            e++;
                            client.removeListener('message', listentome1);
                            return log("---------------------------");
                        });
                    }
                });
            }

            function doLocation() {
                var dlUsersNo = [];
                var dlUsersYes = [];

                users.get().then(function (querySnapshot) {
                    var l = 0;
                    querySnapshot.forEach(function (doc) {
                        l++;

                        var times = (doc.data().timesetCommands) ? doc.data().timesetCommands : null;
                        var locationTimes = (times && times.location) ? times.location.toString().split(",") : null;
                        var timezone = (doc.data().tz) ? doc.data().tz : null;

                        if (!locationTimes) {
                            dlUsersNo.push(doc.id);
                        } else {
                            switch (timezone) {
                                case "EDT", "EST", null:
                                    var hotspot = "New_York";
                                    break;
                                case "CDT":
                                    var hotspot = "Chicago";
                                    break;
                                case "MDT":
                                    var hotspot = "Salt_Lake_City";
                                    break;
                                case "MST":
                                    var hotspot = "Phoenix";
                                    break;
                                case "PDT":
                                    var hotspot = "Los_Angeles";
                                    break;
                                case "AKDT":
                                    var hotspot = "Anchorage";
                                    break;
                                case "HST":
                                    var hotspot = "Honolulu";
                                    break;
                                default:
                                    var hotspot = "New_York";
                            }

                            var localTime = new Date().toLocaleString("en-US", { timeZone: "America/" + hotspot });
                            localTime = new Date(localTime);
                            var lt = localTime.toLocaleString();
                            var hour = lt.slice(lt.indexOf(", ") + 2, lt.indexOf(":")) + lt.slice(-2);

                            if (!locationTimes.includes(hour)) {
                                dlUsersNo.push(doc.id);
                            } else {
                                var state = (doc.data().state) ? doc.data().state : null;
                                var county = (doc.data().county) ? doc.data().county : null;

                                if (state && county) {
                                    var location = county + " " + state;
                                } else if (state) {
                                    var location = state;
                                } else if (county) {
                                    var location = county;
                                } else {
                                    log("User " + doc.id + " has no location set.");
                                    var location = null;
                                }

                                if (location && !locations.includes(location)) {
                                    // console.log(location);
                                    locations.push(location);

                                    var token = doc.id + Math.floor(100000 + Math.random() * 999999);
                                    msg.channel.send("!botcases " + location + " " + token);

                                    client.on('message', function locationsListen(message) {
                                        if (message.author.id == "692117206108209253" && message.channel.id == "696894398293737512" && message.content.includes(token) && !message.content.includes("!botcases")) {
                                            var data = message.content.replace(token + " ", "").toString();
                                            var matches = data.match(/\d+/g);
                                            locationsMatches[locations.indexOf(location)] = matches;

                                            var d = new Date();

                                            var month = (d.getMonth() + 1 < 10) ? ("0" + (d.getMonth() + 1).toString()) : (d.getMonth() + 1).toString();
                                            var day = (d.getDate() + 1 < 10) ? ("0" + (d.getDate() + 1).toString()) : (d.getDate() + 1).toString();
                                            var hour = (d.getHours() < 10) ? ("0" + (d.getHours().toString())) : d.getHours().toString();

                                            var addr = (location.replace(" ", "_") + "." + d.getFullYear().toString() + month + day + hour).toString();

                                            dlUsersYes.push(doc.id);
                                            eval("users.doc('" + doc.id + "').update({'" + addr + "': '" + data + "'});");

                                            client.users.get(doc.id).send(data);

                                            client.removeListener('message', locationsListen);
                                        }
                                    });
                                } else if (location && locations.includes(location)) {
                                    dlUsersYes.push(doc.id);
                                    log("Location " + location + " has already been queried, getting data for that location from stored memory.");
                                    var data = locationsMatches[locations.indexOf(location)];
                                    client.users.get(doc.id).send(data);
                                } else {
                                    error("Error occurred, location undefined.");
                                }
                            }
                        }

                        if (l == querySnapshot.size) {
                            log("---------------------------");
                            pass++;
                            return doWatchlist();
                        }
                    });
                }).catch(function (err) {
                    error(err);
                    e++;
                    client.users.get('377934017548386307').send("Error occurred with activation location retrieval.");
                    return log("---------------------------");
                });
            }

            function doWatchlist() {
                var dwlUsersNo = [];
                var dwlUsersYes = [];
                
                users.get().then(function (querySnapshot) {
                    var l = 0;
                    querySnapshot.forEach(function (doc) {
                        l++;

                        var times = (doc.data().timesetCommands) ? doc.data().timesetCommands : null;
                        var watchlistTimes = (times && times.watchlist) ? times.watchlist.toString().split(",") : null;
                        var timezone = (doc.data().tz) ? doc.data().tz : null;

                        if (!watchlistTimes) {
                            dwlUsersNo.push(doc.id);
                        } else {
                            switch (timezone) {
                                case "EDT", "EST", null:
                                    var hotspot = "New_York";
                                    break;
                                case "CDT":
                                    var hotspot = "Chicago";
                                    break;
                                case "MDT":
                                    var hotspot = "Salt_Lake_City";
                                    break;
                                case "MST":
                                    var hotspot = "Phoenix";
                                    break;
                                case "PDT":
                                    var hotspot = "Los_Angeles";
                                    break;
                                case "AKDT":
                                    var hotspot = "Anchorage";
                                    break;
                                case "HST":
                                    var hotspot = "Honolulu";
                                    break;
                                default:
                                    var hotspot = "New_York";
                            }

                            var localTime = new Date().toLocaleString("en-US", { timeZone: "America/" + hotspot });
                            localTime = new Date(localTime);
                            var lt = localTime.toLocaleString();
                            var hour = lt.slice(lt.indexOf(", ") + 2, lt.indexOf(":")) + lt.slice(-2);

                            if (!watchlistTimes.includes(hour)) {
                                dwlUsersNo.push(doc.id);
                            } else {
                                var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;

                                if (watchlist) {
                                    for (i = 0; i < watchlist.length; i++) {
                                        var location = watchlist[i].toString();

                                        if (locations.indexOf(location) == -1) {
                                            locations.push(location);

                                            var token = doc.id + Math.floor(100000 + Math.random() * 999999);
                                            msg.channel.send("!botcases " + location + " " + token);

                                            console.log(location);


                                            client.once('message', function watchlistListen(message) {
                                                if (message.author.id == "692117206108209253" && message.channel.id == "696894398293737512" && message.content.includes(token) && !message.content.includes("!botcases")) {
                                                    console.log(location);

                                                    var data = message.content.replace(token + " ", "").toString();
                                                    var matches = data.match(/\d+/g);
                                                    locationsMatches[locations.indexOf(location)] = matches;

                                                    var d = new Date();

                                                    var month = (d.getMonth() + 1 < 10) ? ("0" + (d.getMonth() + 1).toString()) : (d.getMonth() + 1).toString();
                                                    var day = (d.getDate() + 1 < 10) ? ("0" + (d.getDate() + 1).toString()) : (d.getDate() + 1).toString();
                                                    var hour = (d.getHours() < 10) ? ("0" + (d.getHours().toString())) : d.getHours().toString();

                                                    var addr = (location.replace(" ", "_") + "." + d.getFullYear().toString() + month + day + hour).toString();

                                                    dwlUsersYes.push(doc.id);
                                                    eval("users.doc('" + doc.id + "').update({'" + addr + "': '" + data + "'});");
                                                    client.users.get(doc.id).send(data);

                                                    client.removeListener('message', watchlistListen);
                                                }
                                            });
                                        } else {
                                            dwlUsersYes.push(doc.id);
                                            log("Location " + location + " has already been queried, getting data for that location from stored memory.");
                                            var data = locationsMatches[locations.indexOf(location)];

                                            if (!locationsMatches) {
                                                console.log("this ain't it chief");
                                            } else if (data) {
                                                console.log(data);
                                                client.users.get(doc.id).send(data);
                                            } else {
                                                console.log(locationsMatches, "Error occurred here");
                                            }
                                        }
                                    }
                                } else if (!watchlist) {
                                    log("User " + doc.id + " does not have a watchlist");
                                }
                            }
                        }

                        if (l == querySnapshot.size) {
                            log("---------------------------");
                            pass++;
                            return;
                        }
                    });
                }).catch(function (err) {
                    error(err);
                    e++;
                    client.users.get('377934017548386307').send("Error occurred with activation watchlist retrieval.");
                    return log("---------------------------");
                });
            }

            doWorst();

            function finish() {
                let endThisAll = new Promise((resolve) => {

                    var mlUsersSuccess = [];
                    var mlUsersFailure = [];

                    db.collection('mailinglist').get().then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            var emails = (doc.data().emails) ? doc.data().emails : null;
                            if (!emails) {
                                return log("No emails in the document with id " + doc.id);
                            } else {
                                emails.forEach(function (value, key) {
                                    auth.sendPasswordResetEmail(value).then(function () {
                                        mlUsersSuccess.push(doc.id);
                                    }).catch(function (err) {
                                        mlUsersFailure.push(doc.id);
                                        error(err);
                                        e++;
                                    });
                                });
                            }
                        });
                    }).then(function () {
                        log("Successful email attempts: " + mlUsersSuccess);
                        log("Failed email attempts: " + mlUsersFailure);
                        return log("---------------------------");
                    }).catch(function (err) {
                        error(err);
                        e++;
                        client.users.get('377934017548386307').send("Error occurred with activation mailing list delivery.");
                        return log("---------------------------");
                    });

                    resolve(true);

                }).then(function (result) {
                    if (pass == 4) {
                        log("Finished updating!");

                        if (result && e == 0) {
                            client.users.get('377934017548386307').send("Finished updating everyone successfully!");
                            log("Finished updating everyone! No errors occurred!");
                        } else if (result && e != 0) {
                            client.users.get('377934017548386307').send("Finished updating everyone with " + e + " errors.");
                            log("Finished updating everyone! " + e + " errors were found.");
                        }
                        return log("---------------------------");
                    } else {
                        error("Interesting...");
                    }
                });
            }
            
            break;
        case "website", "site":
            const websiteEmbed = {
                title: 'CovidBot19 Website',
                url: 'https://covidbot19.web.app',
                description: 'Click the link to go to our website! (WIP)',
            };

            msg.channel.send({ embed: websiteEmbed });
            break;
        case "discord":
            const discordEmbed = {
                title: 'CovidBot19 Discord Server',
                url: 'https://discord.gg/Cg7E8ms',
                description: 'Click the link to join our Discord Server!',
            };

            msg.channel.send({ embed: discordEmbed });
            break;
        case "restrictions":
            if (!args.length || args.length != 1) {
                return msg.reply("To use the restrictions command, please follow the paradigm:\n" +
                    "```!restrictions <state (abbreviation)> ```Note: At this moment, only states in the US is supported.");
            } else {
                var i = stateNumbers.indexOf(args[0].toUpperCase());

                var text = "";
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        text = this.responseText;
                        text = JSON.parse(text);
                        var state = JSON.stringify(text.features[i].attributes["NAME"]);
                        var general = JSON.stringify(text.features[i].attributes["Statewide_Limits_on_Gatherings_"]);
                        var school = JSON.stringify(text.features[i].attributes["Statewide_School_Closures"]);
                        msg.reply("State of " + state.substring(1, state.length - 1)
                            + ":\nLockdown Order? - " + general.substring(1, general.length - 1) + "\nSchool Closed? - " + school.substring(1, school.length - 1) + "\n Dislaimer: Data may be out of date for some places; check your DOH site to see more accurate data.");
                    }
                };
                xhttp.open("GET", "https://services3.arcgis.com/EvmgEO8WtpouUbyD/arcgis/rest/services/COVID19_State_Actions_Download/FeatureServer/0/query?where=1%3D1&outFields=STUSPS,NAME,Statewide_School_Closures,Statewide_Limits_on_Gatherings_&returnGeometry=false&outSR=4326&f=json", true);
                xhttp.send();
            }
            break;
        case "news": case "articles":
            var url = 'http://newsapi.org/v2/top-headlines?' +
                'q=COVID&category=health&country=US&' +
                'sortBy=popularity&' +
                'apiKey=e55f2d04dbae45d4bc5c253924f6d3ed';

            var xhttp = new XMLHttpRequest();
            var articles = [];
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    articles = JSON.parse(this.responseText).articles;

                    var newsEmbed = new Discord.RichEmbed().setTitle("Top Headlines for COVID-19")
                        .setColor("#C70039")
                        .setFooter("API: newsapi.org");

                    for (i = 0; i < 5; i++) {
                        var dateArray = new Date(new Date(articles[0]["publishedAt"]) - new Date().getTimezoneOffset()).toString().split(' ')
                        var date = dateArray[1] + " " + dateArray[2] + " " + dateArray[3];

                        var title = articles[i]["title"];
                        var desc = articles[i]["description"].substr(0, 101) + "...";
                        var url = articles[i]["url"];
                        var source = articles[i]["source"]["name"] + " | " + date;

                        newsEmbed.addField(title, desc + " (" + source + ") | [Open article](" + url + ")");
                    }

                    msg.channel.send({ embed: newsEmbed });
                }
            };

            xhttp.open("GET", url, true);
            xhttp.send();
            break;
        case "suggest":
            if (!args.length || args.length != 1) {
                return msg.reply("To use the suggest command, please follow the paradigm:\n" +
                    "```!suggest <recommendation (max length: 400 characters)> ```Note: Our developers are humans and can't implement every feature you suggest. " +
                    "If you ");
            } else {
                var i = stateNumbers.indexOf(args[0].toUpperCase());

                var text = "";
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        text = this.responseText;
                        text = JSON.parse(text);
                        var state = JSON.stringify(text.features[i].attributes["NAME"]);
                        var general = JSON.stringify(text.features[i].attributes["Statewide_Limits_on_Gatherings_"]);
                        var school = JSON.stringify(text.features[i].attributes["Statewide_School_Closures"]);
                        msg.reply("State of " + state.substring(1, state.length - 1)
                            + ":\nLockdown Order? - " + general.substring(1, general.length - 1) + "\nSchool Closed? - " + school.substring(1, school.length - 1) + "\n Dislaimer: Data may be out of date for some places; check your DOH site to see more accurate data.");
                    }
                };
                xhttp.open("GET", "https://services3.arcgis.com/EvmgEO8WtpouUbyD/arcgis/rest/services/COVID19_State_Actions_Download/FeatureServer/0/query?where=1%3D1&outFields=STUSPS,NAME,Statewide_School_Closures,Statewide_Limits_on_Gatherings_&returnGeometry=false&outSR=4326&f=json", true);
                xhttp.send();
            }
            break;
        case "help":
            const helpEmbed = new Discord.RichEmbed()
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
                .addField("Cases",
                    "`!cases <level (county, state, country)> <chart (optional)>` - sends number of cases at the specified level of data plus an optional chart modelling historic data.\n"
                )
                .addField("Restrictions",
                    "`!restrictions <state (abbreviation)>` - sends the general and school restrictions at the state level.\n"
                )
                .addField("News",
                    "!news or !articles (no args) - returns the top 5 headlines in the US related to COVID-19.\n"
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
                .addField("Timeset",
                    "`!timeset <level (county, state, country)>` - subscribes to the specified level of data, allowing direct messages from the bot for new cases.\n"
                )
                .addField("Watchlist",
                    "`!watchlist <view (no args)/add/remove/clear (no args)> <county (optional)> <state (abbreviation)>` - adds a specific location to your watchlist.\n"
                )
                .addField("Website",
                    "`!site (no args)` - Sends our website URL.\n"
                )
                .addField("Discord Server",
                    "`!discord (no args)` - Sends the invite link to our Discord Server.\n"
                )
                .setFooter('Data Source: Arcgis | DM Rasmit#2549 if you have any difficulties');
            msg.channel.send({ embed: helpEmbed });
            break;
        case "mimic":
            if (id != "377934017548386307" && id != "181965297249550336" && id != "527873651748634624") {
                msg.reply("You can't use that command! You're not cool enough! Go do your homework!");
                return log("User " + id + " attempted to use !mimic without permission.");
            } else {
                if (msg.content.slice(7).includes("!")) {
                    var commandToMimic = msg.content.slice(8);
                } else {
                    var commandToMimic = msg.content.slice(7);
                }

                if (msg.content.includes("channel=")) {
                    var cid = msg.content.slice(msg.content.indexOf("channel=") + 8);
                    if (cid.length == 21 && /<#\d{18}>/g.test(cid)) {
                        var channelToMimic = client.channels.find('name', cid);
                        log(channelToMimic);
                    } else {
                        return msg.reply("Looks like you didn't enter the channel correctly! Use `\#<channel-name>` to send to a specific channel.\n You entered: " + cid);
                    }
                } else {
                    var channelToMimic = msg.channel;
                }
                
                return channelToMimic.send("!" + commandToMimic);
            }
            break;
        case "test":
            if (id != "377934017548386307" && id != "181965297249550336" && id != "527873651748634624" && id != "692117206108209253") {
                msg.reply("You can't use that command! You're not smart enough! Go home punk!");
                return log("User " + id + " attempted to use !test without permission.");
            } else if (msg.channel.id != "696894398293737512") {
                return msg.reply("Hey! You shouldn't be doing that nasty stuff in public! Do it somewhere privately!");
            }
                
            var locations = [];
            var locationsMatches = [];

            var dwlUsersNo = [];
            var dwlUsersYes = [];

            users.get().then(function (querySnapshot) {
                var l = 0;
                querySnapshot.forEach(function (doc) {
                    l++;

                    var times = (doc.data().timesetCommands) ? doc.data().timesetCommands : null;
                    var watchlistTimes = (times && times.watchlist) ? times.watchlist.toString().split(",") : null;
                    var timezone = (doc.data().tz) ? doc.data().tz : null;

                    if (!watchlistTimes) {
                        dwlUsersNo.push(doc.id);
                    } else {
                        switch (timezone) {
                            case "EDT", "EST", null:
                                var hotspot = "New_York";
                                break;
                            case "CDT":
                                var hotspot = "Chicago";
                                break;
                            case "MDT":
                                var hotspot = "Salt_Lake_City";
                                break;
                            case "MST":
                                var hotspot = "Phoenix";
                                break;
                            case "PDT":
                                var hotspot = "Los_Angeles";
                                break;
                            case "AKDT":
                                var hotspot = "Anchorage";
                                break;
                            case "HST":
                                var hotspot = "Honolulu";
                                break;
                            default:
                                var hotspot = "New_York";
                        }

                        var localTime = new Date().toLocaleString("en-US", { timeZone: "America/" + hotspot });
                        localTime = new Date(localTime);
                        var lt = localTime.toLocaleString();
                        var hour = lt.slice(lt.indexOf(", ") + 2, lt.indexOf(":")) + lt.slice(-2);

                        if (!watchlistTimes.includes(hour)) {
                            dwlUsersNo.push(doc.id);
                        } else {
                            var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;

                            if (watchlist) {
                                for (i = 0; i < watchlist.length; i++) {
                                    var location = watchlist[i].toString();

                                    if (locations.indexOf(location) == -1) {
                                        locations.push(location);

                                        var token = doc.id + Math.floor(100000 + Math.random() * 999999);
                                        msg.channel.send("!botcases " + location + " " + token);

                                        console.log(location);


                                        client.once('message', function watchlistListen(message) {
                                            if (message.author.id == "692117206108209253" && message.channel.id == "696894398293737512" && message.content.includes(token) && !message.content.includes("!botcases")) {
                                                console.log(location);

                                                var data = message.content.replace(token + " ", "").toString();
                                                var matches = data.match(/\d+/g);
                                                locationsMatches[locations.indexOf(location)] = matches;

                                                var d = new Date();

                                                var month = (d.getMonth() + 1 < 10) ? ("0" + (d.getMonth() + 1).toString()) : (d.getMonth() + 1).toString();
                                                var day = (d.getDate() + 1 < 10) ? ("0" + (d.getDate() + 1).toString()) : (d.getDate() + 1).toString();
                                                var hour = (d.getHours() < 10) ? ("0" + (d.getHours().toString())) : d.getHours().toString();

                                                var addr = (location.replace(" ", "_") + "." + d.getFullYear().toString() + month + day + hour).toString();

                                                dwlUsersYes.push(doc.id);
                                                eval("users.doc('" + doc.id + "').update({'" + addr + "': '" + data + "'});");
                                                client.users.get(doc.id).send(data);

                                                client.removeListener('message', watchlistListen);
                                            }
                                        });
                                    } else {
                                        dwlUsersYes.push(doc.id);
                                        log("Location " + location + " has already been queried, getting data for that location from stored memory.");
                                        var data = locationsMatches[locations.indexOf(location)];

                                        if (!locationsMatches) {
                                            console.log("this ain't it chief");
                                        } else if (data) {
                                            console.log(data);
                                            client.users.get(doc.id).send(data);
                                        } else {
                                            console.log(locationsMatches, "Error occurred here");
                                        }
                                    }
                                }
                            } else if (!watchlist) {
                                log("User " + doc.id + " does not have a watchlist");
                            }
                        }
                    }

                    if (l == querySnapshot.size) {
                        log("---------------------------");
                        pass++;
                        return;
                    }
                });
            }).catch(function (err) {
                error(err);
                e++;
                client.users.get('377934017548386307').send("Error occurred with activation watchlist retrieval.");
                return log("---------------------------");
            });
        default:
            break;
    }
})
// Discord End