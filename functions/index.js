// require("dotenv").config();
// const Discord = require("discord.js");
// const client = new Discord.Client();
const firebase = require('firebase');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = firebase.firestore();

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