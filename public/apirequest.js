// define whether user can request live data, the current state that is being shown, and the current county being shown
window.requestAllowed = true;
window.state = null;
window.county = null;

// block request by setting requestAllowed to false and setting the current state and county
function blockRequest(state, county) {
    window.requestAllowed = false;
    window.state = state;
    window.county = county;
    return;
};

// all the request by setting requestAllowed to true and resetting the current state and counting
function allowRequest() {
    window.requestAllowed = true;
    window.state = null;
    window.county = null;
    return;
};

// ask for data
function cases() {
    // get the state input and make sure it isn't null
    var stateInput = document.getElementById('state');
    var inputState = stateInput.options[stateInput.selectedIndex].value;
    if (!inputState) {
        alert('Please select a state!');
        return;
    }

    // get county value (isn't required, null is fine)
    var countyInput = document.getElementById('county');
    var inputCounty = countyInput.value;

    if (inputCounty.length > "Michigan Department of Corrections (MDOC)".length) {
        return alert("Sorry, this county name is longer than any county in our database. Please make sure you entered a valid county!");
    }

    // if the user is not allowed to ask for live data and the current request parameters aren't equal to the previous ones (in which case data is alr there)
    if (!requestAllowed && state == inputState && county == inputCounty) {
        console.log('request blocked (timeout)');
        // if we have a county, then the location is state + county, otherwise just state; then get that from local storage
        if (inputCounty) {
            var savedData = localStorage.getItem(county + ", " + state);
            var location = county + ", " + state;
        } else {
            var savedData = localStorage.getItem(state);
            var location = state;
        }

        console.log("localStorage");

        // if location is defined (should be, unless user cleared cache stupidly, which they should never do)
        if (location) {
            // get the first and second numbers from the data and do stuff to send to DOM
            var matches = savedData.match(/\d+/g);
            var cases = matches[0];
            var deaths = matches[1];
            var deathRate = (deaths / cases) * 100;
            document.getElementById('location').innerHTML = location;
            document.getElementById('resultsCases').innerHTML = "Cases: " + cases;
            document.getElementById('resultsDeaths').innerHTML = "Deaths: " + deaths;
            document.getElementById('resultsDeathRate').innerHTML = "Death Rate: " + deathRate.toFixed(2) + "%";
            return graph(location);
        } else {
            // this shouldn't happen
            console.log("Error occurred, it is possibly due to caching failure or user intervention.");
        }
    }

    // pick a random channel to send to
    var channels = ["695838084687986738", "696893994247913492", "696894015324291194", "696894101232287785", "696894131972210708", "696894159314747392",
                    "696894185755902002", "696894213194776636", "696894242894774282", "696894279720894475", "696894305058422794", "696894326994632784"];
    var seed = Math.floor(Math.random() * 12);
    var channelID = channels[seed];

    // get a token and send it to the channel with location
    var token = Math.floor(100000 + Math.random() * 999999);
    if (inputCounty != "") {
        client.channels.get(channelID).send("!botcases " + inputCounty + " " + inputState + " " + token);
        var location = inputCounty + ", " + inputState;
    } else {
        client.channels.get(channelID).send("!botcases " + inputState + " " + token);
        var location = inputState;
    }

    blockRequest(inputState, inputCounty);
    setTimeout(allowRequest, 3600000);

    // once we get a message, make sure it's: from the bot, it's in the channel we sent to, and it includes our unique token
    client.on('message', function (msg) {
        if (msg.author.id == "692117206108209253" && msg.channel.id == channelID && msg.content.includes(token)) {
            console.log("bot");
            // block request (see the function itself) and set a timeout to allow the request later after an hour

            // get data and do stuff blah blah
            var data = msg.content.replace(token + " ", " ").toString();
            var matches = data.match(/\d+/g);
            var cases = matches[0];
            var deaths = matches[1];
            var deathRate = (deaths / cases) * 100;

            // save location data to cache
            localStorage.setItem(location, matches);
            console.log("data saved to cache for later retrieval");

            // serve data to the user
            document.getElementById('location').innerHTML = location;
            document.getElementById('resultsCases').innerHTML = "Cases: " + cases;
            document.getElementById('resultsDeaths').innerHTML = "Deaths: " + deaths;
            document.getElementById('resultsDeathRate').innerHTML = "Death Rate: " + deathRate.toFixed(2) + "%";
            return graph(location);
        }
    });
};

// get data for US (expand later)
function countryCases() {
    // get the data from localstorage and check to see if it exists
    var savedData = localStorage.getItem('US');

    // if it exists
    if (savedData) {
        // get the time right now
        var dateNow = new Date().valueOf();

        // compare to see how long it has been
        var matches = savedData.match(/\d+/g);
        // if younger than 30 minutes...
        var age = (dateNow - matches[4]) / 1800000;
        if (age < 1) {
            console.log("country localStorage, ", age);

            // use cache data
            var cases = matches[0];
            var deaths = matches[1];
            document.getElementById('USCases').innerHTML = "Cases: " + cases;
            document.getElementById('USDeaths').innerHTML = "Deaths: " + deaths;
            return;
        } else {
            // if older, go straight to the bot request
            console.log('country localStorage found but too old, ', age);
        }
    }

    // send !cases to the main bot-talk channel
    client.channels.get('695838084687986738').send("!cases");

    // once a message is received
    client.on('message', function (msg) {
        // if the sender is a bot, it's in the bot-talk channel, and it contains "The county of US"
        if (msg.author.id == "692117206108209253" && msg.channel.id == "695838084687986738" && msg.content.includes('The country of US')) {
            console.log("country bot");

            // get the data
            var matches = msg.content.match(/\d+/g);
            var cases = matches[0];
            var deaths = matches[1];

            // get a new date and save it to the data array
            var date = new Date();
            matches.push(date.valueOf());

            // send that array to localstorage
            localStorage.setItem("US", matches);
            console.log("country data saved to cache for later retrieval");

            // serve data to user
            document.getElementById('USCases').innerHTML = "Cases: " + cases;
            document.getElementById('USDeaths').innerHTML = "Deaths: " + deaths;
            return;
        }
    });
};

// get data graph
function graph(location) {
    // get localstorage
    var savedGraphData = localStorage.getItem(location + "image");

    // check if it exists
    if (savedGraphData) {
        // get the current date
        var dateNow = new Date();

        var matches = savedGraphData.split(",");
        var age = (dateNow.valueOf() - matches[1]) / 3600000;

        // if it's been less than an hour
        if (age < 1 || Math.sign(age) == -1) {
            console.log("graph localStorage, ", age);

            // get from localstorage
            var graph = document.getElementById("graph");
            var graphUrl = matches[0];
            graph.src = graphUrl;
            return;
        } else if (age >= 1) {
            // if more than an hour continue to request bot
            console.log('graph localStorage found but too old, ', age);
        } else {
            // this means it isn't less than equal to or greater than 1, so must be wrong type?
            console.log("Error checking age of cache data.");
        }
    }

    // pick a channel, any channel
    var channels = ["695838084687986738", "696893994247913492", "696894015324291194", "696894101232287785", "696894131972210708", "696894159314747392",
        "696894185755902002", "696894213194776636", "696894242894774282", "696894279720894475", "696894305058422794", "696894326994632784"];
    var seed = Math.floor(Math.random() * 12);
    var channelID = channels[seed];

    // send to the channel
    client.channels.get(channelID).send("!graph " + location.replace(", ", " "));

    // once you get a message
    client.on('message', function (msg) {
        // if the sender is a bot and the message is in the correct channel
        if (msg.author.id == "692117206108209253" && msg.channel.id == channelID) {
            console.log("graph bot");

            // get the graph url and put it on the page
            var graph = document.getElementById("graph");
            var graphUrl = msg.attachments.first().url;
            graph.src = graphUrl;

            // get a new date and save it it with the graph url to localstorage
            var date = new Date();
            var dateValue = date.valueOf();
            var imageKey = location + "image";
            var value = [graphUrl, dateValue];
            localStorage.setItem(imageKey, value);
            console.log("image saved to cache for later retrieval");
            return;
        }
    });
};

function checkUpdate(location, data) {
    usersUser.get().then(function (doc) {
        
    });
};

function worstCounties() {
    client.channels.get("696894398293737512").send('!worst');
    client.on('message', function (message) {
        if (message.author.id == "692117206108209253" && message.channel.id == "696894398293737512") {
            db.collection('users').where("countySubscription", "==", true).get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    console.log("countySubscription ", doc.data().id);

                    message.embeds.forEach((embed) => {
                        client.users.get(doc.id).send({
                            embed: embed
                        });
                    });
                });
            }).catch(function (error) {
                console.log("Error getting documents: ", error);
            });
        }
    });
};

// email the user
function email() {
    // get all the location documents
    db.collection('mailinglist').get().then(function (querySnapshot) {
        querySnapshot.forEach(async function (doc) {
            // get all the emails for that loocation
            var emails = doc.data().emails;
            
            // email each user with the "password reset" email (customized in FB console)
            emails.forEach(function (value, key) {
                auth.sendPasswordResetEmail(value).then(function () {
                    console.log("Email sent to user " + key + " with email " + value);
                }).catch(function (error) {
                    console.log("Error occurred emailing users: ", error);
                });
            });
        });
    });
};

// get previous updates
function retrieveUpdates() {
    if (!user) return console.log("No user, please ask for signin/signup");
    usersUser.get().then(function (doc) {
        if (!doc.data()) return console.log("User does not exist somehow.");

        var watchlist = doc.data().watchlist;

        var state = (doc.data().state) ? doc.data().state : null;
        var county = (doc.data().county) ? doc.data().county : null;

        if (state && county) {
            var location = county + " " + state;
        } else if (state) {
            var location = state;
        } else if (county) {
            var location = county;
        } else {
            console.log("User " + doc.id + " has no location set.");
        }
        
        // MAKE SURE YOU USE THE LOCATION!

        for (i = 0; i < watchlist.length; i++) {
            var watchlistLocation = watchlist[i].toString().replace(" ", "_");
            eval("var watchlistLocationData = doc.data()." + watchlistLocation + ";");

            if (!watchlistLocationData) return console.log("Location " + watchlistLocation + " has no saved data.");
            
            for (const key in watchlistLocationData) {
                var data = watchlistLocationData[key];

                var year = key.slice(0, 4);
                var month = key.slice(4, 6);
                var day = key.slice(6, 8);
                var hour = key.slice(8, 10);

                var date = hour + " " + month + "/" + day + "/" + year;

                var matches = data.match(/\d+/g);
                var cases = matches[0];
                var deaths = matches[1];
                var deathRate = (deaths / cases) * 100;

                console.log(`${date}: [${cases}, ${deaths}, ${deathRate}]`);
            }
        }
    });
};