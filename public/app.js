const firebase = require('firebase');

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

const protobuf = require("protobufjs");

const messaging = firebase.messaging();

messaging.requestPermission().then(function () {
    console.log('Permission granted');
    return messaging.getToken();
}).then(function (token) {
    console.log(token);
}).catch(function (err) {
    console.log('Error occurred.');
})