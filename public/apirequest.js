window.requestAllowed = true;
window.state = null;
window.county = null;

function cases() {
    var stateInput = document.getElementById('state');
    var state = stateInput.options[stateInput.selectedIndex].value;
    if (!state) {
        alert('Please select a state!');
        return;
    }

    if (state == "DC") {
        alert('DC is currently not working! Sorry! We are working to fix this!');
    }

    var countyInput = document.getElementById('county');
    var county = countyInput.value;

    if (!requestAllowed && window.state == state && window.county == countyInput.value) {
        alert("We have set a cooldown on the 'Get Data' button in order to prevent spam or attacks. Please wait a little more or change an input value!");
        return;
    }

    var token = Math.floor(100000 + Math.random() * 999999);
    if (county != "") {
        client.channels.get('695838084687986738').send("!cases " + county + " " + state);// + "::::: " + token);
        var location = county + ", " + state;
    } else {
        client.channels.get('695838084687986738').send("!cases " + state);// + "::::: ") + token);
        var location = state;
    }

    client.once('message', function () { console.log('hii') });

    client.on('message', function (msg) {
        if (msg.author.id == "692117206108209253" && msg.channel.id == "695838084687986738") {// && msg.content.includes(token)) {
            var matches = msg.content.match(/\d+/g);
            console.log(matches);
            // var data = msg.content.replace(token + " ", "");
            blockRequest(state, county);
            setTimeout(allowRequest, 6000);
            var cases = matches[0];
            var deaths = matches[1];
            document.getElementById('location').innerHTML = location;
            document.getElementById('resultsCases').innerHTML = "Cases: " + cases;
            document.getElementById('resultsDeaths').innerHTML = "Deaths: " + deaths;
            return;
        }
    })
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