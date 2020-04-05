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

    var countyInput = document.getElementById('county');
    var county = countyInput.value;

    if (!requestAllowed && window.state == state && window.county == countyInput.value) {
        console.log("no");
        return;
    }

    var token = Math.floor(100000 + Math.random() * 900000);
    if (county != "") {
        client.channels.get('695838084687986738').send("!botcases " + county + " " + state + " " + token);
    } else {
        client.channels.get('695838084687986738').send("!botcases " + state + " " + token);
    }

    client.on('message', function (msg) {
        if (msg.author.id == "692117206108209253" && msg.channel.id == "695838084687986738" && msg.content.includes(token)) {
            var matches = msg.content.match(/\d+/g);
            var data = msg.content.replace(token + " ", "");
            blockRequest(state, county);
            setTimeout(allowRequest, 6000);
            document.getElementById('dataResult').innerHTML = data;
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