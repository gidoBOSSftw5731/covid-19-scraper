firebase.initializeApp({
    apiKey: "AIzaSyDMq0mi1Se1KXRyqaIwVZnv1csYshtrgu0",
    authDomain: "coronavirusbot19.firebaseapp.com",
    databaseURL: "https://coronavirusbot19.firebaseio.com",
    projectId: "coronavirusbot19",
    storageBucket: "coronavirusbot19.appspot.com",
    messagingSenderId: "814043085257",
    appId: "1:814043085257:web:d4151d18cb5d4a16ca1018",
    measurementId: "G-4TKZD7504L"
});

var db = firebase.firestore();
db.enablePersistence();

var users = db.collection("users");
var emails = db.collection("emails");

var analytics = firebase.analytics();

window.onload = function () {
    var version = localStorage.getItem("version");
    if (version != "0.2") {
        localStorage.clear();
        localStorage.setItem("version", "0.2");
    }
        
    $('#stopTime').toast('hide');
    var date = new Date();
    var hours = (date.getHours() <= 12) ? date.getHours() : (date.getHours() - 12);
    var minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    document.getElementById("popupTime").innerHTML = hours.toString() + ":" + minutes.toString();
    $('#toast').toast('show');
};

document.addEventListener('keydown', function (event) {
    const key = event.key;
    if (key == "Enter") {
        if (document.getElementById('search').value.toString().toLowerCase() != "") {
            search();
        } else if (document.getElementById('popupsignin').style.display != "none") {
            signIn();
        } else if (document.getElementById('signup').style.display != "none") {
            handleSignUp();
        } else if (document.getElementById('pwreset').style.display != "none") {
            sendPasswordReset();
        }
        // ADD ENTER KEYPRESS LISTENER FOR DISCORD SIGNIN
    }
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        pageLoad(true);
    } else {
        pageLoad(false);
    }
});

function pageLoad(u) {
    var urlParams = new URLSearchParams(window.location.search);
    var content = urlParams.get('content');

    switch (content) {
        case "homepage": case null:
            xhttp("homepage", "main-content-wrapper");
            xhttp("discordToast", "toast-wrapper");

            break;
        case "data":
            xhttp("data", "main-content-wrapper");
            xhttp("discordToast", "toast-wrapper");

            db.collection('env').doc('env').get().then(function (doc) {
                window.client = new Discord.Client();
                client.login(doc.data().token);
                client.on('ready', function () {
                    console.log('CovidSite Client is ready for use!');
                    countryCases();
                });

                window.botClient = new Discord.Client();
                botClient.login(doc.data().token0);
                botClient.on('ready', function () {
                    console.log("CovidBot Client is ready for use!");
                });
            }).catch(function (err) {
                console.log(err);
            });

            break;
        case "discord":
            xhttp("discord", "main-content-wrapper");
            xhttp("basicToast", "toast-wrapper");

            break;
    }

    xhttp("auth", "auth-wrapper");

    if (u) {
        document.getElementById("signin").innerHTML = "Sign Out";

        window.user = firebase.auth().currentUser;
        window.displayName = user.displayName;
        window.usersUser = users.doc(displayName);
    } else {
        window.user = null;
    }
};

function xhttp(source, tag) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(tag).innerHTML = this.responseText;
        }
    };

    xhttp.open("GET", `${source}.html`, true);
    xhttp.send();
};

function redirect(source) {
    var newURL = "?content=" + source;
    history.pushState(source, source, newURL);

    if (source == "homepage") {
        xhttp("homepage", "main-content-wrapper");
        xhttp("discordToast", "toast-wrapper");
    } else if (source == "data") {
        xhttp("data", "main-content-wrapper");
        xhttp("discordToast", "toast-wrapper");

        db.collection('env').doc('env').get().then(function (doc) {
            window.client = new Discord.Client();
            client.login(doc.data().token);
            client.on('ready', function () {
                console.log('CovidSite Client is ready for use!');
                countryCases();
            });

            window.botClient = new Discord.Client();
            botClient.login(doc.data().token0);
            botClient.on('ready', function () {
                console.log("CovidBot Client is ready for use!");
            });
        }).catch(function (err) {
            console.log(err);
        });
    } else if (source == "discord") {
        xhttp("discord", "main-content-wrapper");
        xhttp("basicToast", "toast-wrapper");
    }
}

window.onpopstate = function (event) {
    var urlParams = new URLSearchParams(window.location.search);
    var content = urlParams.get('content');
 
    if (content == "homepage" || !content) {
        xhttp("homepage", "main-content-wrapper");
        xhttp("discordToast", "toast-wrapper");
    } else if (content == "data") {
        xhttp("data", "main-content-wrapper");
        xhttp("discordToast", "toast-wrapper");

        db.collection('env').doc('env').get().then(function (doc) {
            window.client = new Discord.Client();
            client.login(doc.data().token);
            client.on('ready', function () {
                console.log('CovidSite Client is ready for use!');
                countryCases();
            });

            window.botClient = new Discord.Client();
            botClient.login(doc.data().token0);
            botClient.on('ready', function () {
                console.log("CovidBot Client is ready for use!");
            });
        }).catch(function (err) {
            console.log(err);
        });
    } else if (content == "discord") {
        xhttp("discord", "main-content-wrapper");
        xhttp("basicToast", "toast-wrapper");
    }
};

function display(elem) {
    $('#' + elem).toggle();
};

function togglepsi() {
    if (document.getElementById('popupsignin').style.display == "none") {
        $('#popupsignin').show();
        $("#popupsignin").animate({
            top: '0.015%'
        });
        $('#popupsignin').css({
            'background-color': 'rgba(0,0,0,0.5)'
        });
    } else {
        $("#popupsignin").animate({
            top: '-150%',
        });
        $('#popupsignin').css({
            'background-color': 'rgba(0,0,0,0)'
        });
        setTimeout(function () {
            $('#popupsignin').hide();
        }, 360);
    }
};

function toggleSlideMenu() {
    if (document.getElementById('slideinmenu').style.display == "none") {
        $('#slideinmenu').show();
        $("#slideinmenu").animate({
            left: '97%',
        });
    } else {
        $("#slideinmenu").animate({
            left: '100%',
        });

        setTimeout(function () {
            $('#slideinmenu').hide();
        }, 360);
    }
};