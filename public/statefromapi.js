function loadInStates() {
    console.log("wheeeeee");
    var elem = document.getElementById("state");
    country = "US";
    var re = /[\w(\w )]+/;
    var fragment = document.createDocumentFragment();

    doRequestWrap("https://buttstuff.ops-netman.net/liststates/" + country).then(function (text){
        decoded = Buffer.from(text.toString(), 'base64');

        states = decoded.matchAll(re);
        
        states.forEach(function(state, index) {
            if (index == 0) {
                continue;
            }
            console.log(state);

            opt = elem.createElement('option');
            opt.innerHTML = state;
            opt.value = state;
            fragment.appendChild(opt);
        })
        elem.appendChild(fragment);
    });
};

async function doRequestWrap(url) {
    return await doRequest(url);
};

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