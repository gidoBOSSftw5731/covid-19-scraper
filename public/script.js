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
    
// const Discord = require(['discord.js']);
// const client = new Discord.Client();
// client.login(process.env.BOT_TOKEN);
// client.on('ready', () => {
//     console.log("Bot Ready!");
//     client.users.get('377934017548386307').send("Hello!");
// });

// client.on('message', (msg) => {
//     console.log(msg.content);
// });

// function test() {
//     console.log(client);
//     client.user("377934017548386307").then(user => {
//         console.log(user);
//         user.send("Use this token: " + token + " to " + method + " on https://covidbot19.web.app !");
//     });
//     return 1;
// };

var db = firebase.firestore();
db.enablePersistence();

var client = new Discord.Client({
    token: "token here",
    autorun: true
});

var users = db.collection("users");
var emails = db.collection("emails");

var messaging = firebase.messaging();
messaging.requestPermission().then(function () {
    console.log('Permission granted');
    return messaging.getToken();
}).then(function (token) {
    console.log(token);
}).catch(function (err) {
    console.log('Error occurred');
});

messaging.onMessage(function (payload) {
    console.log('onMessage: ', payload);
});

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
    if (u == true) {
        document.getElementById("signin").innerHTML = "Sign Out";

        window.user = firebase.auth().currentUser;
        window.displayName = user.displayName;
        window.usersUser = users.doc(displayName);
    } else {
        window.user = null;
    }
};

function redirect(pagePath) {
    window.location.replace(pagePath);
};

function display(elem) {
    $('#' + elem).toggle();
};

function togglepsi() {
    if (document.getElementById('popupsignin').style.display == "none") {
        $('#popupsignin').show();
        $("#popupsignin").animate({
            top: '0.015%',
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