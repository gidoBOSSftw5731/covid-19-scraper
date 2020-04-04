const protobuf = require(["protobuf"]);
const request = require(['request']);
const fs = require(['fs'], function (fs) {
    fs.readFile(apiproto, (err, data) => {
        var data = data.toString();
        console.log(data);
        console.log("err1 ", err);
    });
});

var county = "Forsyth";
var state = "GA";
var country = "US" // someone will fix this later

const httpAPI = "https://buttstuff.ops-netman.net";
const apiproto = 'https://github.com/gidoBOSSftw5731/covid-19-scraper/blob/master/apiListener/proto/api.proto';

async function doRequestWrap(url) {
    return await doRequest(url);
}

function doRequest(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
};

if (county == "") {
    ext = "/" + country + "/" + state;
} else {
    ext = "/currentinfo/" + country + "/" + state + "/" + county;
}

doRequestWrap(httpAPI + ext).then(function (text) {
    console.log(text);

    buf = [];
    for (var i = 0; i < Buffer.from(text.toString(), 'base64').length; i++) {
        buf.push(Buffer.from(text.toString(), 'base64')[i]);
    }

    result = AreaInfo.decode(buf);
    var confirmed = result.ConfirmedCases;
    var deaths = result.Deaths;
    var update = new Date(result.UnixTimeOfRequest).toISOString();
    msg.reply('Confirmed: ' + confirmed + ', Deaths: ' + deaths + ' in ' + county + ' as of ' + update);
})
