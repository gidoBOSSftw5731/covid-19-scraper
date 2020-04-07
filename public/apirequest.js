window.requestAllowed = true;
window.state = null;
window.county = null;

function cases() {
    var stateInput = document.getElementById('state');
    var inputState = stateInput.options[stateInput.selectedIndex].value;
    if (!inputState) {
        alert('Please select a state!');
        return;
    }

    var countyInput = document.getElementById('county');
    var inputCounty = countyInput.value;

    if (!requestAllowed && state == inputState && county == inputCounty) {
        console.log('request blocked (timeout)');
        if (inputCounty) {
            var savedData = localStorage.getItem(state + "_" + county);
            var location = county + ", " + state;
        }
        else {
            var savedData = localStorage.getItem(state);
            var location = state;
        }

        console.log("localStorage");

        var matches = savedData.match(/\d+/g);
        var cases = matches[0];
        var deaths = matches[1];
        document.getElementById('location').innerHTML = location;
        document.getElementById('resultsCases').innerHTML = "Cases: " + cases;
        document.getElementById('resultsDeaths').innerHTML = "Deaths: " + deaths;
        return graph(location);
    }

    var channels = ["695838084687986738", "696893994247913492", "696894015324291194", "696894101232287785", "696894131972210708", "696894159314747392",
                    "696894185755902002", "696894213194776636", "696894242894774282", "696894279720894475", "696894305058422794", "696894326994632784"];
    var seed = Math.floor(Math.random() * 12);
    var channelID = channels[seed];

    var token = Math.floor(100000 + Math.random() * 999999);
    if (inputCounty != "") {
        client.channels.get(channelID).send("!botcases " + inputCounty + " " + inputState + " " + token);
        var location = inputCounty + ", " + inputState;
    } else {
        client.channels.get(channelID).send("!botcases " + inputState + " " + token);
        var location = inputState;
    }

    client.on('message', function (msg) {
        if (msg.author.id == "692117206108209253" && msg.channel.id == channelID && msg.content.includes(token)) {
            console.log("bot");
            blockRequest(inputState, inputCounty);
            setTimeout(allowRequest, 3600000);

            var data = msg.content.replace(token + " ", " ").toString();
            var matches = data.match(/\d+/g);
            var cases = matches[0];
            var deaths = matches[1];

            localStorage.setItem(location, matches);
            console.log("data saved to cache for later retrieval");

            document.getElementById('location').innerHTML = location;
            document.getElementById('resultsCases').innerHTML = "Cases: " + cases;
            document.getElementById('resultsDeaths').innerHTML = "Deaths: " + deaths;
            return graph(location);
        }
    });
};

function countryCases() {
    var savedData = localStorage.getItem('US');

    if (savedData) {
        var dateNow = new Date().valueOf();

        var matches = savedData.match(/\d+/g);
        var age = (dateNow - matches[4]) / 1800000;
        if (age < 1) {
            console.log("country localStorage, ", age);

            var cases = matches[0];
            var deaths = matches[1];
            document.getElementById('USCases').innerHTML = "Cases: " + cases;
            document.getElementById('USDeaths').innerHTML = "Deaths: " + deaths;
            return;
        } else {
            console.log('country localStorage found but too old, ', age);
        }
    }

    client.channels.get('695838084687986738').send("!cases");

    client.on('message', function (msg) {
        if (msg.author.id == "692117206108209253" && msg.channel.id == "695838084687986738" && msg.content.includes('The country of US')) {
            console.log("country bot");

            var matches = msg.content.match(/\d+/g);
            var cases = matches[0];
            var deaths = matches[1];

            var date = new Date();
            matches.push(date.valueOf());

            localStorage.setItem("US", matches);
            console.log("country data saved to cache for later retrieval");

            document.getElementById('USCases').innerHTML = "Cases: " + cases;
            document.getElementById('USDeaths').innerHTML = "Deaths: " + deaths;
            return;
        }
    });
};

function graph(location) {
    var savedGraphData = localStorage.getItem(location + "image");

    if (savedGraphData) {
        var dateNow = new Date();

        var age = (dateNow.valueOf() - savedGraphData[1]) / 3600000;
        console.log(savedGraphData[1]);
        if (age < 1 || Math.sign(age) == -1) {
            console.log("graph localStorage, ", age);

            var graph = document.getElementById("graph");
            var graphUrl = savedGraphData[0];
            graph.src = graphUrl;
            return;
        } else if (age > 1) {
            console.log('graph localStorage found but too old, ', age);
        } else {
            console.log("Error checking age of cache data.");
        }
    }

    var channels = ["695838084687986738", "696893994247913492", "696894015324291194", "696894101232287785", "696894131972210708", "696894159314747392",
        "696894185755902002", "696894213194776636", "696894242894774282", "696894279720894475", "696894305058422794", "696894326994632784"];
    var seed = Math.floor(Math.random() * 12);
    var channelID = channels[seed];

    client.channels.get(channelID).send("!graph " + location.replace(", ", " "));

    client.on('message', function (msg) {
        if (msg.author.id == "692117206108209253" && msg.channel.id == channelID) {
            console.log("graph bot");

            var graph = document.getElementById("graph");
            var graphUrl = msg.attachments.first().url;
            graph.src = graphUrl;

            var date = new Date();
            var dateValue = date.valueOf();
            var imageKey = location + "image";
            var value = [graphUrl, dateValue]
            localStorage.setItem(imageKey, value);
            console.log("image saved to cache for later retrieval");
            return;
        }
    });
};

function blockRequest(state, county) {
    window.requestAllowed = false;
    window.state = state;
    window.county = county;
    return;
};

function allowRequest() {
    window.requestAllowed = true;
    window.state = null;
    window.county = null;
    return;
};