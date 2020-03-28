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

const protobuf = require('protobufjs');
const Schema = require('../apiListener/proto/api_pb.js');

exports.sendDM = functions.firestore.document('users/{userID}').onWrite((change, context) => {
    console.log('change triggered');

    client.on("ready", () => {
        console.log(`Client user tag: ${client.user.tag}!`);
    });

    client.fetchUser("377934017548386307", false).then(user => {
        user.send("42069");
    });

    client.login(process.env.BOT_TOKEN);
});

exports.protobuffer = functions.https.onRequest((req, res) => {
    protobuf.load(Schema, function (err, root) {
        if (err)
            throw err;
        
        var decodedMessage = Schema.decode('https://buttstuff.ops-netman.net/stateinfo/US/Virginia/Fairfax');
        var message = Schema.fromObject({ awesomeField: 42 });
        
        // var ListOfCountries = root.lookupType('apiproto.getCountry');
    });

    console.log(Schema);
    console.log(Schema.ListOfCounties());
});

exports.arcgisgetter = functions.https.onRequest((req, res) => {

    //console.log(oldArcGISData)

    console.log(req.file)
    buffer = req.file.data

  
    if (buffer.toString() == oldArcGISData) {
        res.status(200).send("no change");
        return;
    } else {
        res.status(200).send("This means they were not the same");
        oldArcGISData = buffer.toString();
    }

    try {
        data = JSON.parse(buffer.toString());
    } catch(err) {
        console.error(err);
    }

    batch = db.batch();
    i = 0;
    data.features.forEach(function(value) {
        p = value.properties;
        console.log(p);
        db.collection('test').doc('test1').set({name: "hello"});
        //console.log(p.Combined_Key)
        if (i > 19) {
            try {
                console.log("batch commit inbound");
                batch.commit();
                i = 0;
                batch = db.batch();
            } catch (err) {
                console.log(err);
            }
            var waitTill = new Date(new Date().getTime() + 1 * 30); // prevent rate limiting
            while(waitTill > new Date()){};
        }

        let ref = db.collection('AGData').doc(p.Combined_Key);
        batch.set(ref, p);

        i++;
    });
    batch.commit();
    
});