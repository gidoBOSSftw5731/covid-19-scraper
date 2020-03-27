// require("dotenv").config();
// const Discord = require("discord.js");
// const client = new Discord.Client();
const firebase = require('firebase');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
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
const db = firebase.firestore();
const AGFileURL = "https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson"
var oldArcGISData

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

exports.arcgisgetter = functions.https.onRequest((req, res) => {

    //console.log(oldArcGISData)

    fetch(AGFileURL).then(res => res.buffer()).then(buffer => {
        if (buffer == oldArcGISData) {
            res.status(200).send("no change")
            //return
        } else {
            res.status(200).send("This means they were not the same")
            oldArcGISData = buffer.toString()
        }

        // now we update the FS (firestore DB)
        try {
            data = JSON.parse(buffer.toString())
        } catch(err) {
            console.error(err)
        }

        batch = db.batch()
        i = 0
        data.features.forEach(function(value){
            p = value.properties
            //console.log(p.Combined_Key)
            if (i > 490) {
                try {
                    console.log("batch commit inbound")
                    batch.commit()

                
                i = 0
                batch = db.batch()
                } catch(err) {
                console.log(err)
                }
                var waitTill = new Date(new Date().getTime() + 1 * 3000) // prevent rate limiting
                while(waitTill > new Date()){}
            }

            let ref = db.collection('AGData').doc(p.Combined_Key)
            batch.set(ref, p)

            i++
        });

    })
});