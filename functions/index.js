// require("dotenv").config();
// const Discord = require("discord.js");
// const client = new Discord.Client();
const firebase = require('firebase');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = firebase.firestore();
const AGFileURL = "https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson"

exports.sendDM = functions.firestore.document('users/{userID}').onWrite((change, context) => {
    console.log('change triggered');

    client.on("ready", () => {
        console.log(`Client user tag: ${client.user.tag}!`);
    });

    client.fetchUser("377934017548386307", false).then(user => {
        user.send("42069");
    })

    client.login(process.env.BOT_TOKEN)
});

exports.updateFSArcGIShttp = functions.https.onRequest((req, res) => {
    let oldData = req.body.data

    fetch(AGFileURL).then(res => res.buffer()).then(buffer => {
        if (buffer == oldData) {
            res.status(200).send("works!")
        } else {
            res.status(404).send("This means they were not the same")
        }
    })
});