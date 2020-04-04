// const protobuf = require(["https://github.com/protobufjs/protobuf.js/blob/master/dist/minimal/protobuf.min.js"]);
// var urllib = require(['https://github.com/node-modules/urllib/blob/master/lib/urllib.js'], function (urllib) {
    // console.log(urllib);
// });
// const request = require(['https://github.com/request/request/blob/master/request.js']);

// var fs = require(['fs']);
// fs.writeFile('/test.txt', 'Cool, I can do this in the browser!', function (err) {
//     fs.readFile('/test.txt', function (err, contents) {
//         console.log(contents.toString());
//     });
// });


// const apiproto = 'https://github.com/gidoBOSSftw5731/covid-19-scraper/blob/master/apiListener/proto/api.proto';
// const httpAPI = "https://buttstuff.ops-netman.net";
// const url = "https://buttstuff.ops-netman.net/stateinfo/US/Virginia/Fairfax";

// var county = "Forsyth";
// var state = "GA";
// var country = "US" // someone will fix this later

// async function doRequestWrap(url) {
//     return await doRequest(url);
// }

// function doRequest(url) {
//     return new Promise(function (resolve, reject) {
//         urllib.request(url, function (error, body, res) {
//             if (!error && res.statusCode == 200) {
//                 resolve(body);
//             } else {
//                 reject(error);
//             }
//         });
//     });
// };

// if (county == "") {
//     ext = "/" + country + "/" + state;
// } else {
//     ext = "/currentinfo/" + country + "/" + state + "/" + county;
// }

// doRequestWrap(httpAPI + ext).then(function (text) {
//     console.log(text);

//     buf = [];
//     for (var i = 0; i < Buffer.from(text.toString(), 'base64').length; i++) {
//         buf.push(Buffer.from(text.toString(), 'base64')[i]);
//     }

//     result = AreaInfo.decode(buf);
//     var confirmed = result.ConfirmedCases;
//     var deaths = result.Deaths;
//     var update = new Date(result.UnixTimeOfRequest).toISOString();
//     console.log('Confirmed: ' + confirmed + ', Deaths: ' + deaths + ' in ' + county + ' as of ' + update);
// })
