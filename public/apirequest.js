function cases() {
    var stateInput = document.getElementById('state');
    var state = stateInput.options[stateInput.selectedIndex].value;
    if (!state) {
        alert('Please select a state!');
        return;
    }
    
    var countyInput = document.getElementById('county');
    if (countyInput.value != "") {
        var county = countyInput.value;
        client.channels.get('695838084687986738').send("!cases " + county + " " + state);
    } else {
        client.channels.get('695838084687986738').send("!cases " + state);
    }

    client.on('message', function (msg) {
        if (msg.author.id == "692117206108209253" && msg.channel.id == "695838084687986738") {
            var matches = msg.content.match(/\d+/g);
            console.log(msg.content);
            document.getElementById('dataResult').innerHTML = msg.content;
            msg.channel.send(matches);
        }
    })
};