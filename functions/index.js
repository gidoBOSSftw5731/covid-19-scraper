require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const firebase = require('firebase');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./coronavirusbot19-firebase-adminsdk-sckiv-6ca1e54162.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://coronavirusbot19.firebaseio.com"
});
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

const db = admin.firestore();


const AGFileURL = "https://opendata.arcgis.com/datasets/628578697fb24d8ea4c32fa0c5ae1843_0.geojson";
var oldArcGISData;

/*
const protobuf = require('protobufjs');
const Schema = require('../apiListener/proto/api_pb.js');

exports.userJoinMessage = functions.firestore.document('users/{userID}').onCreate((change, context) => {
    console.log('change triggered');

    client.on("ready", () => {
        console.log(`Client user tag: ${context.params.userID}!`);
    });

    client.fetchUser(context.params.userID, false).then(user => {
        user.send("You just signed up for CovidBot19! Use !help to pick a next move! What will it be?");
    });

    client.login(process.env.BOT_TOKEN);
});

exports.countyUpdate = functions.firestore.document('AGData/{string}').onWrite((change, context) => {
    const newData = change.after.data();
    console.log(newData);

    const location = context.params.string.split(', ');
    const county = location[0];
    const state = location[1];
    console.log('State: ', state, " County: ", county);

    client.fetchUser('377934017548386307', false).then(user => {
        user.send("Some updates on ")
    })
});

exports.getCountyData = functions.https.onCall((data, context) => {
    
    db.collection('AGData').where("Admin2", "==", data.county).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            console.log(doc.id, " => ", doc.data());
            return {
                "data": doc.data()
            };
        });
    });
});
*/

exports.addNumbers = functions.https.onCall((data, context) => {

    const county = data.county;
    const state = data.state;

    if (!county || !state) {
        return {
            failure: 'failure'
        };
    }

    const location = county + ", " + state + ", US";// this is bad
    console.log(location);
    
    // return async function () {
    //     await db.collection('AGData').doc(location).get();
    // }.then(async function(doc) {
    //     var confirmed = await doc.data().Confirmed;
    //     var deaths = await doc.data().Deaths();
    //     return {
    //         confirmed: confirmed,
    //         deaths: deaths,
    //     };
    // });

    /*
    function Data() {
        db.collection('AGData').doc(location).get().then((doc) => {
            const docData = doc.data();
        });
        return {
            confirmed: function () {
                db.collection('AGData').doc(location).get().then((doc) => {
                    const docData = doc.data();
                    return docData.Confirmed;
                });
            },

            deaths: function () {
                db.collection('AGData').doc(location).get().then((doc) => {
                    const docData = doc.data();
                    return docData.Deaths;
                });
            }
        }
    }

    let dataObj = Data();
    let confirmed = dataObj.confirmed();
    let deaths = dataObj.deaths();

    return {
        confirmed: confirmed,
        deaths: deaths
    };
    */

    try {
        var testVar
        d = db.collection('AGData').doc(location).get().then((doc) => {
            var docData = doc.data();
            console.log(docData);
            testVar = docData
            return docData
        });
    } catch (e) {
        console.log("failure");
    } finally {
        return docData
    }

    
});

/*
exports.protobuffer = functions.https.onRequest((req, res) => {
    var pieceofbullshit = new Schema.HistoricalInfo();
    console.log(pieceofbullshit);

    pieceofbullshit.getHistoricalInfo();
});
*/
