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

    if (state == "DC") {
        alert('DC is currently not working! Sorry! We are working to fix this!');
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
        return;
    }

    // var token = Math.floor(100000 + Math.random() * 999999);
    if (inputCounty != "") {
        client.channels.get('695838084687986738').send("!cases " + inputCounty + " " + inputState);// + "::::: " + token);
        var location = inputCounty + ", " + inputState;
    } else {
        client.channels.get('695838084687986738').send("!cases " + inputState);// + "::::: ") + token);
        var location = inputState;
    }

    client.on('message', function (msg) {
        if (msg.author.id == "692117206108209253" && msg.channel.id == "695838084687986738") {// && msg.content.includes(token)) {
            console.log("bot");
            blockRequest(inputState, inputCounty);
            setTimeout(allowRequest, 3600000);

            var matches = msg.content.match(/\d+/g);
            var cases = matches[0];
            var deaths = matches[1];

            localStorage.setItem(location, matches);
            console.log("data saved to cache for later retrieval");

            // var data = msg.content.replace(token + " ", "");
            document.getElementById('location').innerHTML = location;
            document.getElementById('resultsCases').innerHTML = "Cases: " + cases;
            document.getElementById('resultsDeaths').innerHTML = "Deaths: " + deaths;
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