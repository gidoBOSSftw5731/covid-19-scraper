function states() {
    console.log("wheeeeee");
    var elem = document.getElementById("state");
    var country = "US";
    var re = /[\w(\w )]+/g;
    var fragment = document.createDocumentFragment();

    fetch("https://buttstuff.ops-netman.net/liststates/" + country).then(function (text){
        resp = text.text().then(function (resp) {
            decoded = atob(resp.toString());

            states = decoded.match(re);
            console.log(states)
            
            states.forEach(function(state, index) {
                
                console.log(state);
    
                opt = document.createElement('option');
                opt.innerHTML = state;
                opt.value = state;
                fragment.appendChild(opt);
            })
            elem.appendChild(fragment);
            }).catch(function (error) {
                var code = error.code;
                var message = error.message;
                var details = error.details;
                console.error('There was an error when calling the Cloud Function', error);
                console.log('There was an error when calling the Cloud Function:\n\nError Code: '
                    + code + '\nError Message:' + message + '\nError Details:' + details);
            })
        })
        
    }
    

async function doRequestWrap(url) {
    return await doRequest(url);
};

function doRequest(url) {
    return new Promise(function (resolve, reject) {
        var request = new Request(url, function (error, res, body) {
            console.log(body);
            if (!error && res.statusCode == 200) {
                console.log(body);
                resolve(body);
            } else {
                console.log(error);
                reject(error);
            }
        });
    });
};
