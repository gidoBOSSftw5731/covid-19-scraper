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
        console.log("no, ", );
        return;
    }

    if (county != "") {
        client.channels.get('695838084687986738').send("!cases " + county + " " + state);
    } else {
        client.channels.get('695838084687986738').send("!cases " + state);
    }

    client.on('message', function (msg) {
        if (msg.author.id == "692117206108209253" && msg.channel.id == "695838084687986738") {
            var matches = msg.content.match(/\d+/g);
            blockRequest(state, county);
            setTimeout(allowRequest, 6000);
            document.getElementById('dataResult').innerHTML = msg.content;
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