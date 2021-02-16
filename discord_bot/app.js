'use strict';

const Discord = require("discord.js");
const client = new Discord.Client({ disableEveryone: true });

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var firebase = require("firebase");
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

var admin = require("firebase-admin");
var serviceAccount = require("./coronavirusbot19-firebase-adminsdk-sckiv-6ca1e54162.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://coronavirusbot19.firebaseio.com"
});

let db = admin.firestore();

function isUpperCase(str) {
    return str === str.toUpperCase();
}

db.collection('env').doc('env').get().then(function (doc) {
    client.login(doc.data().token0).catch(err => {
        error(err);
    });

    client.on("ready", function readysetgo() {
        log(`Client user tag: ${client.user.id}!`);
        client.user.setActivity("alone | !help", { type: "Playing" });

        client.channels.get("696894398293737512").send("!test");

        return client.removeListener('on', readysetgo);
    })
}).catch(function (err) {
    error(err);
});

function error(err) {
    var date = new Date();
    client.channels.get("696540781787217952").send("<@377934017548386307> " + date + " " + err);

    console.log(date, err);
};

function log(message) {
    var date = new Date();
    client.channels.get("696540781787217952").send(date + " " + message);
};

client.setMaxListeners(15);

const stateNumbers = ['WV','FL','IL','MN','MD','RI','ID','NH','NC','VT','CT','DE','NM','CA','NJ','WI','OR','NE','PA','WA','LA','GA','AL','UT','OH','TX','CO','SC','OK','TN','WY','HI','ND','KY','VI','MP','GU','ME','NY','NV','AK','AS','MI','AR','MS','MO','MT','KS','IN','PR','SD','MA','VA','DC','IA'];
const stateAbbrv = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

const countriesObject2 = {
    "AF": "Afghanistan",
    "AL": "Albania",
    "DZ": "Algeria",
    "AS": "American Samoa",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguilla",
    "AQ": "Antarctica",
    "AG": "Antigua and Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas (the)",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia (Plurinational State of)",
    "BQ": "Bonaire, Sint Eustatius and Saba",
    "BA": "Bosnia and Herzegovina",
    "BW": "Botswana",
    "BV": "Bouvet Island",
    "BR": "Brazil",
    "IO": "British Indian Ocean Territory (the)",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "CV": "Cabo Verde",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "KY": "Cayman Islands (the)",
    "CF": "Central African Republic (the)",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CX": "Christmas Island",
    "CC": "Cocos (Keeling) Islands (the)",
    "CO": "Colombia",
    "KM": "Comoros (the)",
    "CD": "Congo (the Democratic Republic of the)",
    "CG": "Congo (the)",
    "CK": "Cook Islands (the)",
    "CR": "Costa Rica",
    "HR": "Croatia",
    "CU": "Cuba",
    "CW": "Curaçao",
    "CY": "Cyprus",
    "CZ": "Czechia",
    "CI": "Côte d'Ivoire",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic (the)",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "SZ": "Eswatini",
    "ET": "Ethiopia",
    "FK": "Falkland Islands (the) [Malvinas]",
    "FO": "Faroe Islands (the)",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GF": "French Guiana",
    "PF": "French Polynesia",
    "TF": "French Southern Territories (the)",
    "GA": "Gabon",
    "GM": "Gambia (the)",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Greece",
    "GL": "Greenland",
    "GD": "Grenada",
    "GP": "Guadeloupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HM": "Heard Island and McDonald Islands",
    "VA": "Holy See (the)",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran (Islamic Republic of)",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IM": "Isle of Man",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JE": "Jersey",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KP": "Korea (the Democratic People's Republic of)",
    "KR": "Korea (the Republic of)",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao People's Democratic Republic (the)",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands (the)",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "YT": "Mayotte",
    "MX": "Mexico",
    "FM": "Micronesia (Federated States of)",
    "MD": "Moldova (the Republic of)",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands (the)",
    "NC": "New Caledonia",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger (the)",
    "NG": "Nigeria",
    "NU": "Niue",
    "NF": "Norfolk Island",
    "MP": "Northern Mariana Islands (the)",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestine, State of",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines (the)",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "MK": "Republic of North Macedonia",
    "RO": "Romania",
    "RU": "Russian Federation (the)",
    "RW": "Rwanda",
    "RE": "Réunion",
    "BL": "Saint Barthélemy",
    "SH": "Saint Helena, Ascension and Tristan da Cunha",
    "KN": "Saint Kitts and Nevis",
    "LC": "Saint Lucia",
    "MF": "Saint Martin (French part)",
    "PM": "Saint Pierre and Miquelon",
    "VC": "Saint Vincent and the Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome and Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SX": "Sint Maarten (Dutch part)",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "GS": "South Georgia and the South Sandwich Islands",
    "SS": "South Sudan",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan (the)",
    "SR": "Suriname",
    "SJ": "Svalbard and Jan Mayen",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syrian Arab Republic",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "Tanzania, United Republic of",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinidad and Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TC": "Turks and Caicos Islands (the)",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates (the)",
    "GB": "United Kingdom of Great Britain and Northern Ireland (the)",
    "UM": "United States Minor Outlying Islands (the)",
    "US": "United States of America (the)",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Venezuela (Bolivarian Republic of)",
    "VN": "Viet Nam",
    "VG": "Virgin Islands (British)",
    "VI": "Virgin Islands (U.S.)",
    "WF": "Wallis and Futuna",
    "EH": "Western Sahara",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe",
    "AX": "Åland Islands"
};

const countriesObject3 = {
    "AFG": "Afghanistan",
    "ALB": "Albania",
    "DZA": "Algeria",
    "ASM": "American Samoa",
    "AND": "Andorra",
    "AGO": "Angola",
    "AIA": "Anguilla",
    "ATA": "Antarctica",
    "ATG": "Antigua and Barbuda",
    "ARG": "Argentina",
    "ARM": "Armenia",
    "ABW": "Aruba",
    "AUS": "Australia",
    "AUT": "Austria",
    "AZE": "Azerbaijan",
    "BHS": "Bahamas (the)",
    "BHR": "Bahrain",
    "BGD": "Bangladesh",
    "BRB": "Barbados",
    "BLR": "Belarus",
    "BEL": "Belgium",
    "BLZ": "Belize",
    "BEN": "Benin",
    "BMU": "Bermuda",
    "BTN": "Bhutan",
    "BOL": "Bolivia (Plurinational State of)",
    "BES": "Bonaire, Sint Eustatius and Saba",
    "BIH": "Bosnia and Herzegovina",
    "BWA": "Botswana",
    "BVT": "Bouvet Island",
    "BRA": "Brazil",
    "IOT": "British Indian Ocean Territory (the)",
    "BRN": "Brunei Darussalam",
    "BGR": "Bulgaria",
    "BFA": "Burkina Faso",
    "BDI": "Burundi",
    "CPV": "Cabo Verde",
    "KHM": "Cambodia",
    "CMR": "Cameroon",
    "CAN": "Canada",
    "CYM": "Cayman Islands (the)",
    "CAF": "Central African Republic (the)",
    "TCD": "Chad",
    "CHL": "Chile",
    "CHN": "China",
    "CXR": "Christmas Island",
    "CCK": "Cocos (Keeling) Islands (the)",
    "COL": "Colombia",
    "COM": "Comoros (the)",
    "COD": "Congo (the Democratic Republic of the)",
    "COG": "Congo (the)",
    "COK": "Cook Islands (the)",
    "CRI": "Costa Rica",
    "HRV": "Croatia",
    "CUB": "Cuba",
    "CUW": "Curaçao",
    "CYP": "Cyprus",
    "CZE": "Czechia",
    "CIV": "Côte d'Ivoire",
    "DNK": "Denmark",
    "DJI": "Djibouti",
    "DMA": "Dominica",
    "DOM": "Dominican Republic (the)",
    "ECU": "Ecuador",
    "EGY": "Egypt",
    "SLV": "El Salvador",
    "GNQ": "Equatorial Guinea",
    "ERI": "Eritrea",
    "EST": "Estonia",
    "SWZ": "Eswatini",
    "ETH": "Ethiopia",
    "FLK": "Falkland Islands (the) [Malvinas]",
    "FRO": "Faroe Islands (the)",
    "FJI": "Fiji",
    "FIN": "Finland",
    "FRA": "France",
    "GUF": "French Guiana",
    "PYF": "French Polynesia",
    "ATF": "French Southern Territories (the)",
    "GAB": "Gabon",
    "GMB": "Gambia (the)",
    "GEO": "Georgia",
    "DEU": "Germany",
    "GHA": "Ghana",
    "GIB": "Gibraltar",
    "GRC": "Greece",
    "GRL": "Greenland",
    "GRD": "Grenada",
    "GLP": "Guadeloupe",
    "GUM": "Guam",
    "GTM": "Guatemala",
    "GGY": "Guernsey",
    "GIN": "Guinea",
    "GNB": "Guinea-Bissau",
    "GUY": "Guyana",
    "HTI": "Haiti",
    "HMD": "Heard Island and McDonald Islands",
    "VAT": "Holy See (the)",
    "HND": "Honduras",
    "HKG": "Hong Kong",
    "HUN": "Hungary",
    "ISL": "Iceland",
    "IND": "India",
    "IDN": "Indonesia",
    "IRN": "Iran (Islamic Republic of)",
    "IRQ": "Iraq",
    "IRL": "Ireland",
    "IMN": "Isle of Man",
    "ISR": "Israel",
    "ITA": "Italy",
    "JAM": "Jamaica",
    "JPN": "Japan",
    "JEY": "Jersey",
    "JOR": "Jordan",
    "KAZ": "Kazakhstan",
    "KEN": "Kenya",
    "KIR": "Kiribati",
    "PRK": "Korea (the Democratic People's Republic of)",
    "KOR": "Korea (the Republic of)",
    "KWT": "Kuwait",
    "KGZ": "Kyrgyzstan",
    "LAO": "Lao People's Democratic Republic (the)",
    "LVA": "Latvia",
    "LBN": "Lebanon",
    "LSO": "Lesotho",
    "LBR": "Liberia",
    "LBY": "Libya",
    "LIE": "Liechtenstein",
    "LTU": "Lithuania",
    "LUX": "Luxembourg",
    "MAC": "Macao",
    "MDG": "Madagascar",
    "MWI": "Malawi",
    "MYS": "Malaysia",
    "MDV": "Maldives",
    "MLI": "Mali",
    "MLT": "Malta",
    "MHL": "Marshall Islands (the)",
    "MTQ": "Martinique",
    "MRT": "Mauritania",
    "MUS": "Mauritius",
    "MYT": "Mayotte",
    "MEX": "Mexico",
    "FSM": "Micronesia (Federated States of)",
    "MDA": "Moldova (the Republic of)",
    "MCO": "Monaco",
    "MNG": "Mongolia",
    "MNE": "Montenegro",
    "MSR": "Montserrat",
    "MAR": "Morocco",
    "MOZ": "Mozambique",
    "MMR": "Myanmar",
    "NAM": "Namibia",
    "NRU": "Nauru",
    "NPL": "Nepal",
    "NLD": "Netherlands (the)",
    "NCL": "New Caledonia",
    "NZL": "New Zealand",
    "NIC": "Nicaragua",
    "NER": "Niger (the)",
    "NGA": "Nigeria",
    "NIU": "Niue",
    "NFK": "Norfolk Island",
    "MNP": "Northern Mariana Islands (the)",
    "NOR": "Norway",
    "OMN": "Oman",
    "PAK": "Pakistan",
    "PLW": "Palau",
    "PSE": "Palestine, State of",
    "PAN": "Panama",
    "PNG": "Papua New Guinea",
    "PRY": "Paraguay",
    "PER": "Peru",
    "PHL": "Philippines (the)",
    "PCN": "Pitcairn",
    "POL": "Poland",
    "PRT": "Portugal",
    "PRI": "Puerto Rico",
    "QAT": "Qatar",
    "MKD": "Republic of North Macedonia",
    "ROU": "Romania",
    "RUS": "Russian Federation (the)",
    "RWA": "Rwanda",
    "REU": "Réunion",
    "BLM": "Saint Barthélemy",
    "SHN": "Saint Helena, Ascension and Tristan da Cunha",
    "KNA": "Saint Kitts and Nevis",
    "LCA": "Saint Lucia",
    "MAF": "Saint Martin (French part)",
    "SPM": "Saint Pierre and Miquelon",
    "VCT": "Saint Vincent and the Grenadines",
    "WSM": "Samoa",
    "SMR": "San Marino",
    "STP": "Sao Tome and Principe",
    "SAU": "Saudi Arabia",
    "SEN": "Senegal",
    "SRB": "Serbia",
    "SYC": "Seychelles",
    "SLE": "Sierra Leone",
    "SGP": "Singapore",
    "SXM": "Sint Maarten (Dutch part)",
    "SVK": "Slovakia",
    "SVN": "Slovenia",
    "SLB": "Solomon Islands",
    "SOM": "Somalia",
    "ZAF": "South Africa",
    "SGS": "South Georgia and the South Sandwich Islands",
    "SSD": "South Sudan",
    "ESP": "Spain",
    "LKA": "Sri Lanka",
    "SDN": "Sudan (the)",
    "SUR": "Suriname",
    "SJM": "Svalbard and Jan Mayen",
    "SWE": "Sweden",
    "CHE": "Switzerland",
    "SYR": "Syrian Arab Republic",
    "TWN": "Taiwan",
    "TJK": "Tajikistan",
    "TZA": "Tanzania, United Republic of",
    "THA": "Thailand",
    "TLS": "Timor-Leste",
    "TGO": "Togo",
    "TKL": "Tokelau",
    "TON": "Tonga",
    "TTO": "Trinidad and Tobago",
    "TUN": "Tunisia",
    "TUR": "Turkey",
    "TKM": "Turkmenistan",
    "TCA": "Turks and Caicos Islands (the)",
    "TUV": "Tuvalu",
    "UGA": "Uganda",
    "UKR": "Ukraine",
    "ARE": "United Arab Emirates (the)",
    "GBR": "United Kingdom of Great Britain and Northern Ireland (the)",
    "UMI": "United States Minor Outlying Islands (the)",
    "USA": "United States of America (the)",
    "URY": "Uruguay",
    "UZB": "Uzbekistan",
    "VUT": "Vanuatu",
    "VEN": "Venezuela (Bolivarian Republic of)",
    "VNM": "Viet Nam",
    "VGB": "Virgin Islands (British)",
    "VIR": "Virgin Islands (U.S.)",
    "WLF": "Wallis and Futuna",
    "ESH": "Western Sahara",
    "YEM": "Yemen",
    "ZMB": "Zambia",
    "ZWE": "Zimbabwe",
    "ALA": "Åland Islands"
};

const countries2 = new Map(Object.entries(countriesObject2));
const countries3 = new Map(Object.entries(countriesObject3));

client.on("message", msg => {
    if (msg.content == "so how was your day") {
        msg.reply("eh, not bad, u?");
    }
    if (msg.content == "so whatcha up to tomorrow?") {
        msg.reply('nothing much, just beating up some b*tches');
    }
    if (msg.content == "the bot is broken") {
        msg.reply("no i'm not");
    }

    if (!msg.content.startsWith("!")) return;

    if (msg.content == ("!activate") && msg.channel.id == "696894398293737512") {
        log("---------------------------");
        log("Activation message received.");
    } else if (msg.author.id == client.user.id && msg.content != "!test") {
        return;
    }

    const args = msg.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();
    const id = msg.author.id;
    const users = db.collection('users');
    const userDoc = users.doc(id);

    switch (command) {
        case "signup":
            userDoc.get().then(function (doc) {
                if (!doc.exists) {
                    userDoc.set({
                        id: id
                    });
                    msg.reply('User created with id: ' + id);
                    client.users.get(id).send('Welcome to the CovidBot19 Community! Use the command `!help` to see a list of commands that you can run!\n' +
                    "This bot is still a WIP, so expect bugs and new features all at the same time!\nAnd don't forget, stay home and wash your hands for 20 seconds!");
                } else {
                    log("Users doc already exists, skipped writing.");
                    msg.reply("You're already signed up!");
                }
            }).catch(function (err) {
                error(err);
            });
            break;
        case "id":
            msg.reply(id);
            break;
        case "location":
            if (!args.length) {
                return msg.reply("To use the location command, please follow the paradigm:\n" +
                    "```!location <county (optional)>  <state (abbreviation)> ```Note: At this moment, only the US is supported.");
            } else {
                var o = "";
                const len = args.length;

                let x = true;

                userDoc.get().then(function (doc) {
                    if (doc.exists) {
                        x = true;
                    } else {
                        x = false;
                    }
                });

                if (len == 3) {
                    var state = args[2].toUpperCase();
                    var countyParts = args.slice(0, 2).toString();
                    var county = countyParts.replace(",", " ");
                } else if (len == 2) {
                    var state = args[1].toUpperCase();
                    var county = args[0];
                } else if (len == 1) {
                    var state = args[0].toString().toUpperCase();
                } else if (args[0] == "clear") {
                    if (x) {
                        let removeLocation = userDoc.update({
                            state: firebase.firestore.FieldValue.delete()
                        }).then(userDoc.update({
                            county: firebase.firestore.FieldValue.delete()
                        })).then(function () {
                            return msg.reply("Your location has been cleared!");
                        });
                    } else {
                        return msg.reply("You don't have an account or location to clear! Use `!signup` to create and account or set your location using !location to automatically create an account.");
                    }
                } else {
                    return error("Args length, " + len + ", did not match any cases");
                }

                if ((typeof state).toString() != "string") {
                    console.log(state);
                    console.log(typeof state);
                    return error("State isn't a string");
                }

                if (!x) {
                    userDoc.set({
                        id: id
                    });

                    client.users.get(id).send('Welcome to the CovidBot19 Community! Use the command `!help` to see a list of commands that you can run!\n' +
                        "This bot is still a WIP, so expect bugs and new features all at the same time!\nAnd don't forget, stay home and wash your hands for 20 seconds!");
                }
                
                for (i = 0; i < args.length; i++) {
                    if (i == 0) {
                        let updateState = userDoc.update({ state: state }).catch(function (e) {
                            error(e);
                        });
                        let removeCounty = userDoc.update({
                            county: admin.firestore.FieldValue.delete()
                        })
                        o += "State: " + state;
                    } else if (i == 1) {
                        if ((typeof county).toString() != "string") {
                            return error("County isn't a string");
                        }
                        let updateCounty = userDoc.update({ county: county }).catch(function (e) {
                            error(e);
                        });
                        o += ", County: " + county;
                    }
                }
                msg.reply(`Location added!\n${o}`);
            }
            break;
        case "subscribe": // this could maybe just add the user to a table in firestore? not that it should but it's possible just saying
            if (!args.length) {
                return msg.reply("To use the subscribe command, please follow the paradigm:\n" +
                    "```!subscribe <level (county, state, country)>```Note: At this moment, only the US is supported.");
            }
            switch (args[0]) {
                case "county":
                    userDoc.set({
                        countySubscription: true
                    }, { merge: true }).then(function () {
                        msg.reply('Subscribed to all county-level updates! These will be sent in your DM to prevent spam.\n Unsubscribe at any time using the command ```!unsubscribe county```');
                    }).catch(function (err) {
                        error(err);
                    });
                    break;
                case "state":
                    userDoc.set({
                        stateSubscription: true
                    }, { merge: true }).then(function () {
                        msg.reply('Subscribed to all state-level updates! These will be sent in your DM to prevent spam.\n Unsubscribe at any time using the command ```!unsubscribe state```');
                    }).catch(function (err) {
                        error(err);
                    });
                    break;
                case "country":
                    userDoc.set({
                        countrySubscription: true
                    }, { merge: true }).then(function () {
                        msg.reply('Subscribed to all country-level updates! These will be sent in your DM to prevent spam.\n Unsubscribe at any time using the command ```!unsubscribe country```');
                    }).catch(function (err) {
                        error(err);
                    });
                    break;
            }
            break;
        case "unsubscribe": 
            if (!args.length) {
                return msg.reply("To use the unsubscribe command, please follow the paradigm:\n" +
                    "```!unsubscribe <level (county, state, country)>```Note: At this moment, only the US is supported.");
            }
            switch (args[0]) {
                case "county":
                    userDoc.set({
                        countySubscription: false
                    }, { merge: true }).then(function () {
                        msg.reply('Unsubcribed from all county-level updates.\n Subscribe at any time using the command ```!subscribe county```');
                    }).catch(function (err) {
                        error(err);
                    });
                    break;
                case "state":
                    userDoc.set({
                        stateSubscription: false
                    }, { merge: true }).then(function () {
                        msg.reply('Unsubcribed from all state-level updates.\n Subscribe at any time using the command ```!subscribe state```');
                    }).catch(function (err) {
                        error(err);
                    });
                    break;
                case "country":
                    userDoc.set({
                        countrySubscription: false
                    }, { merge: true }).then(function () {
                        msg.reply('Unsubcribed from all country-level updates.\n Subscribe at any time using the command ```!subscribe country```');
                    }).catch(function (err) {
                        error(err);
                    });
                    break;
            }
            break;
        case "watchlist":
            if (!args.length) {
                return msg.reply("To use the watchlist command, please follow the paradigm:\n" +
                    "```!watchlist <command> <county (optional)> <state (abbreviation)>```Note: At this moment, only the US is supported.");
            }
            switch (args[0]) {
                case "view":
                    userDoc.get().then(function (doc) {
                        if (!doc.exists) {
                            return msg.reply("Uh oh! Looks like you don't have an account! Create one using !signup and then retry this command.");
                        } else {
                            var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;
                            if (!watchlist) {
                                return msg.reply("Hm, looks like you don't have any locations in your watchlist! Run the command !watchlist add <args> to add something now!");
                            }
                            var watchlistString = "";
                            for (i = 0; i < watchlist.length; i++) {
                                if ((i == (watchlist.length - 1)) && (watchlist.length > 1)) {
                                    watchlistString += "and " + watchlist[i];
                                } else if (watchlist.length > 2) {
                                    watchlistString += watchlist[i] + ", ";
                                } else if (watchlist.length == 2) {
                                    watchlistString += watchlist[i] + " ";
                                } else if (watchlist.length == 1) {
                                    watchlistString = watchlist[0];
                                } else {
                                    error("Error occurred, should be impossible????");
                                    log(watchlist);
                                }
                            }
                            if (watchlistString.length == 0) {
                                return msg.reply("Hm, looks like you don't have any locations in your watchlist! Run the command !watchlist add <args> to add something now!");
                            } else {
                                msg.reply("Your watchlist: " + watchlistString);
                            }
                        }
                    }).catch(function (err) {
                        error(err);
                        return msg.reply("Error getting watchlist data, seems like a problem on our end. Sorry!");
                    });
                    break;
                case "add":
                    var location = args.slice(1, args.length).toString();
                    location = location.replace(",", " ");
                    if (location.split(",").length == 2) {
                        location = location.replace(",", " ");
                    }

                    var lastArg = location[location.length - 1];
                    if (!isUpperCase(lastArg)) {
                        return msg.reply("Looks like you may have typed the command in wrong! Check the full command " +
                            "(!help for how a list of command descriptions) to verify that there are no mistakes and then try again.");
                    }

                    userDoc.get().then(function (doc) {
                        if (!doc.exists) {
                            return msg.reply("Uh oh! Looks like you don't have an account! Create one using !signup and then retry this command.");
                        } else {
                            var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;
                            if (!watchlist) {
                                if (location.length == 3) {
                                    var watchlist = [location[0] + " " + location[1], location[2]];
                                } else {
                                    var watchlist = [location];
                                }

                                userDoc.set({
                                    watchlist: watchlist
                                }, { merge: true }).then(function () {
                                    msg.reply("Added " + location + " to your watchlist!");
                                    return msg.reply("Your new watchlist: " + location);
                                }).catch(function (err) {
                                    error(err);
                                });
                            } else {
                                if (watchlist.includes(location)) {
                                    msg.reply(location + " is already in your watchlist, skipped adding.");
                                    return;
                                }  else {
                                    watchlist.push(location);

                                    var watchlistString = "";
                                    for (i = 0; i < watchlist.length; i++) {
                                        if ((i == (watchlist.length - 1)) && (watchlist.length > 1)) {
                                            watchlistString += "and " + watchlist[i];
                                        } else if (watchlist.length > 2) {
                                            watchlistString += watchlist[i] + ", ";
                                        } else if (watchlist.length == 2) {
                                            watchlistString += watchlist[i] + " ";
                                        } else {
                                            watchlistString = location;
                                        }
                                    }

                                    userDoc.update({
                                        watchlist: watchlist
                                    }).then(function () {
                                        msg.reply("Added " + location + " to your watchlist!");
                                        return msg.reply("Your new watchlist: " + watchlistString);
                                    }).catch(function (err) {
                                        error(err);
                                    });
                                }
                            }
                        }
                    }).catch(function (err) {
                        error(err);
                        return msg.reply("Oh no! Watchlist add failed! Check the full command (!watchlist for a list of arguments) to make sure you didn't make any mistakes!");
                    });
                    break;
                case "remove":
                    var location = args.slice(1, args.length).toString();
                    location = location.replace(",", " ");
                    if (location.split(",").length == 2) {
                        location = location.replace(",", " ");
                    }

                    var lastArg = location[location.length - 1];
                    if (!isUpperCase(lastArg)) {
                        return msg.reply("Looks like you may have typed the command in wrong! Check the full command " +
                            "(!help for how a list of command descriptions) to verify that there are no mistakes and then try again.");
                    }

                    userDoc.get().then(function (doc) {
                        if (!doc.exists) {
                            return msg.reply("Uh oh! Looks like you don't have an account! Create one using !signup and then retry this command.");
                        } else {
                            var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;
                            if (!watchlist) {
                                return msg.reply("Hm, looks like you don't have any locations in your watchlist! Run the command !watchlist add <args> to add something now!");
                            } else {
                                if (watchlist.includes(location)) {
                                    var removeIndex = watchlist.indexOf(location);
                                    var newWatchlist = watchlist.splice(removeIndex, 1);

                                    var watchlistString = "";
                                    for (i = 0; i < watchlist.length; i++) {
                                        if ((i == (watchlist.length - 1)) && (watchlist.length > 1)) {
                                            watchlistString += "and " + watchlist[i];
                                        } else if (watchlist.length > 2) {
                                            watchlistString += watchlist[i] + ", ";
                                        } else if (watchlist.length == 2) {
                                            watchlistString += watchlist[i] + " ";
                                        } else if (watchlist.length == 1) {
                                            watchlistString = watchlist[0];
                                        } else {
                                            error("Error occurred, should be impossible????");
                                            log(watchlist);
                                        }
                                    }

                                    userDoc.update({
                                        watchlist: watchlist
                                    }).then(function () {
                                        msg.reply("Removed " + location + " from your watchlist!");
                                        if (watchlist.length >= 1) {
                                            return msg.reply("Your new watchlist: " + watchlistString);
                                        } else {
                                            return msg.reply("Your watchlist is now empty!");
                                       }
                                    }).catch(function (err) {
                                        error(err);
                                    });
                                } else {
                                    return msg.reply("Hm, looks like you don't have " + location + " in your watchlist!");
                                }
                            }
                        }
                    }).catch(function (err) {
                        error(err);
                        return msg.reply("Oh no! Watchlist add failed! Check the full command (!watchlist for a list of arguments) to make sure you didn't make any mistakes!");
                    });
                    break;
                case "clear":
                    userDoc.get().then(function (doc) {
                        if (!doc.exists) {
                            return msg.reply("Uh oh! Looks like you don't have an account! Create one using !signup.");
                        } else {
                            var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;
                            if (watchlist != "") {
                                userDoc.update({
                                    watchlist: []
                                }).then(function () {
                                    return msg.reply("Successfully cleared your watchlist!");
                                }).catch(function (err) {
                                    error(err);
                                });
                            } else {
                                return msg.reply("Your watchlist is already empty!");
                            }
                        }
                    }).catch(function (err) {
                        error(err);
                        return msg.reply("Oh no! Watchlist clear failed! Check the command to make sure you didn't make any mistakes!");
                    });
                    break;
                default:
                    return msg.reply("I couldn't recognize that command, make sure you typed it in correctly!");
            }
            break;
        case "timeset":
            if (!args.length) {
                return msg.reply("To use the timeset command, please follow the paradigm:\n" +
                    "```!timeset <action (add/remove/view (no args)/timezone (takes your timezone or help))> <subscription method (location, subscribe, or watchlist)> <time (Hour + AM/PM)>```Note: You can only set full hour intervals.");
            }

            var action = args[0];
            if (action != "add" && action != "remove" && action != "view" && action != "timezone") {
                return msg.reply("Oops! Looks like you entered an invalid command! !timeset supports add, remove, view, and timezone.");
            }
            args.shift();

            if (action == "view") {
                var commands = ["location", "subscribe", "watchlist"];
                if (!commands.includes(args[0])) {
                    return msg.reply("Please add a valid subscription method (location, subscribe, or watchlist) to view its timeset list.");
                } else if (args.length != 1) {
                    return msg.reply("The timeset view command only takes one category parameter (location, subscribe, or watchlist). Please do not add any extra parameters.");
                } else {
                    userDoc.get().then(function (doc) {
                        var commandTimes = doc.data().timesetCommands;
                        if (!commandTimes || !commandTimes[args[0]] || commandTimes[args[0]].length < 1) {
                            return msg.reply("Timeset list is empty for " + args[0]);
                        } else {
                            var times = commandTimes[args[0]];
                            return msg.reply(times.toString().replace(/,/g, ", "));
                        }
                    }).catch(function (err) {
                        error(err);
                        return msg.reply("Looks like an error occurred. This is most likely not your fault, so please contact a developer on our server (Command: !discord) or wait for an update.");
                    });
                }
            } else if (action == "timezone") {
                var timezone = args[0].toUpperCase();
                switch (timezone) {
                    case "EDT": case "EST": case "CDT": case "MDT": case "MST": case "PDT": case "PST": case "AKDT": case "HST":
                        userDoc.update({
                            tz: timezone
                        }).then(function () {
                            msg.reply("Your new timezone is " + timezone + "!");
                            return log("User " + id + " given timezone " + timezone + "!");
                        }).catch(function (err) {
                            error(err);
                            msg.reply("Sorry, an error occurred while trying to update your timezone. Try again later!");
                            return e++;
                        });
                        break;
                    case "HELP":
                        return msg.reply("Valid timezones: EDT, CDT, MDT, MST, PDT, AKDT, and HST.\n Go to https://bit.ly/us-timezones to see a list of the accepted timezones.");
                    default:
                        return msg.reply("Please enter a valid timezone or 'help'!");
                }
            } else {
                var commands = ["location", "subscribe", "watchlist"];
                if (!commands.includes(args[0])) {
                    return msg.reply("Oops! Looks like you entered an invalid usage! !timeset supports location, subscribe, and watchlist.");
                }
                var timesetCommand = args[0];

                if (args.length == 1) {
                    return msg.reply("Please enter a time!");
                } else if (args.length == 2) {
                    var time = (args[1]).toUpperCase();
                } else if (args.length == 3) {
                    var time = (args[1] + args[2]).toUpperCase();
                } else {
                    return msg.reply("Oops! Looks like you entered the command wrong! Example: `!timeset add watchlist 4pm`");
                }

                if (!/\b((1[0-2]|0?[1-9])\s?([AaPp][Mm]))/g.test(time)) {
                    return msg.reply("Oops! Looks like you formatted the time wrong! Examples: 4pm, 4PM, 4 pm, 4 PM");
                }

                userDoc.get().then(function (doc) {
                    var commandTimes = doc.data().timesetCommands;
                    if (!commandTimes || !commandTimes[timesetCommand]) {
                        var times = [];
                    } else {
                        var times = commandTimes[timesetCommand];
                    }
                    if (action == "add") {
                        if (times.includes(time)) {
                            return msg.reply("This time is already in your list for " + timesetCommand + "!");
                        } else if (times.length == "3") {
                            return msg.reply("Looks like you already have three times for " + timesetCommand + "! Use !timeset remove <args> to open up space for other times.");
                        } else {
                            times.push(time);
                        }
                    } else if (action == "remove") {
                        if (!times.includes(time)) {
                            return msg.reply("This time is not in your list for " + timesetCommand + "!");
                        } else {
                            var t = times.indexOf(time);
                            times.splice(t, ++t);
                        }
                    }

                    switch (timesetCommand) {
                        case "location":
                            eval(`userDoc.update({ 'timesetCommands.location': times }).catch(function (err) { error(err); });`);
                            break;
                        case "watchlist":
                            eval(`userDoc.update({ 'timesetCommands.watchlist': times }).catch(function (err) { error(err); });`);
                            break;
                        case "subscribe":
                            eval(`userDoc.update({ 'timesetCommands.subscribe': times }).catch(function (err) { error(err); });`);
                            break;
                    }

                    if (action == "add") {
                        var conj = " to ";
                        var past = "ed "
                    } else {
                        var conj = " from ";
                        var past = "d "
                    }
                    return msg.reply("Successfully " + action + past + time + conj + "your " + timesetCommand + " list!\nNew " + timesetCommand + " timeset list: " + times.toString().replace(/,/g, ", "));
                }).catch(function (err) {
                    error(err);
                    return msg.reply("Looks like an error occurred. This is most likely not your fault, so please contact a developer on our server (Command: !discord) or wait for an update.");
                });
            }
            break;
        case "activate":
            if (msg.channel.id != "696894398293737512") return msg.reply("no u");
            msg.reply("Activated! Now starting database query for update-enabled users.");

            var locations = [];
            var locationsMatches = [];

            var pass = 0;
            var e = 0;

            function doWorst() {
                msg.channel.send('!worst');
                client.on('message', function listentome0(message) {
                    if (message.author.id == "692117206108209253" && message.embeds[0] != null && message.channel.id == "696894398293737512") {
                        var dwUsersNo = [];
                        var dwUsersYes = [];

                        users.where("countySubscription", "==", true).get().then(function (querySnapshot) {
                            var l = 0;
                            querySnapshot.forEach(function (doc) {
                                l++;

                                var times = (doc.data().timesetCommands) ? doc.data().timesetCommands : null;
                                var subscribeTimes = (times && times.subscribe) ? times.subscribe.toString().split(",") : null;
                                var timezone = (doc.data().tz) ? doc.data().tz : null;

                                if (!subscribeTimes) {
                                    dwUsersNo.push(doc.id);
                                } else {
                                    switch (timezone) {
                                        case "EDT", "EST", null:
                                            var hotspot = "New_York";
                                            break;
                                        case "CDT":
                                            var hotspot = "Chicago";
                                            break;
                                        case "MDT":
                                            var hotspot = "Salt_Lake_City";
                                            break;
                                        case "MST":
                                            var hotspot = "Phoenix";
                                            break;
                                        case "PDT":
                                            var hotspot = "Los_Angeles";
                                            break;
                                        case "AKDT":
                                            var hotspot = "Anchorage";
                                            break;
                                        case "HST":
                                            var hotspot = "Honolulu";
                                            break;
                                        default:
                                            var hotspot = "New_York";
                                    }

                                    var localTime = new Date().toLocaleString("en-US", { timeZone: "America/" + hotspot });
                                    localTime = new Date(localTime);
                                    var lt = localTime.toLocaleString();
                                    var hour = lt.slice(lt.indexOf(", ") + 2, lt.indexOf(":")) + lt.slice(-2);

                                    if (!subscribeTimes.includes(hour)) {
                                        dwUsersNo.push(doc.id);
                                    } else {
                                        dwUsersYes.push(doc.id);
                                        message.embeds.forEach((embed) => {
                                            client.users.get(doc.id).send({
                                                embed: embed
                                            });
                                        });
                                    }
                                }

                                if (l == querySnapshot.size) {
                                    log("Worst Counties: Successful");
                                    pass++;
                                    client.removeListener('message', listentome0);
                                    return doCountry();
                                }
                            });
                        }).catch(function (err) {
                            error(err);
                            e++;
                            client.removeListener('message', listentome0);
                            return log("Worst Counties: Successful");
                        });
                    }
                });
            }

            function doCountry() {
                setTimeout(function () {
                    msg.channel.send('!cases');
                }, 1000);

                var retry = setTimeout(function () {
                    msg.channel.send('!cases');
                }, 5000);

                var o = true;
                client.on('message', function listentome1(message) {
                    if (message.author.id == "692117206108209253" && message.content.includes("The country of US") && message.channel.id == "696894398293737512" && o) {
                        clearTimeout(retry);

                        o = false;

                        var matches = message.content.match(/\d+/g);
                        var data = [matches[0], matches[1]];

                        var d = new Date();

                        var month = (d.getMonth() + 1 < 10) ? ("0" + (d.getMonth() + 1).toString()) : (d.getMonth() + 1).toString();
                        var day = (d.getDate() + 1 < 10) ? ("0" + (d.getDate() + 1).toString()) : (d.getDate() + 1).toString();
                        var hour = (d.getHours() < 10) ? ("0" + (d.getHours().toString())) : d.getHours().toString();

                        var addr = ("US." + d.getFullYear().toString() + month + day + hour).toString();

                        var dcUsersNo = [];
                        var dcUsersYes = [];

                        users.where("countrySubscription", "==", true).get().then(function (querySnapshot) {
                            var l = 0;
                            querySnapshot.forEach(function (doc) {
                                l++;

                                var times = (doc.data().timesetCommands) ? doc.data().timesetCommands : null;
                                var subscribeTimes = (times && times.subscribe) ? times.subscribe.toString().split(",") : null;
                                var timezone = (doc.data().tz) ? doc.data().tz : null;

                                if (!subscribeTimes) {
                                    dcUsersNo.push(doc.id);
                                } else {
                                    switch (timezone) {
                                        case "EDT", "EST", null:
                                            var hotspot = "New_York";
                                            break;
                                        case "CDT":
                                            var hotspot = "Chicago";
                                            break;
                                        case "MDT":
                                            var hotspot = "Salt_Lake_City";
                                            break;
                                        case "MST":
                                            var hotspot = "Phoenix";
                                            break;
                                        case "PDT":
                                            var hotspot = "Los_Angeles";
                                            break;
                                        case "AKDT":
                                            var hotspot = "Anchorage";
                                            break;
                                        case "HST":
                                            var hotspot = "Honolulu";
                                            break;
                                        default:
                                            var hotspot = "New_York";
                                    }

                                    var localTime = new Date().toLocaleString("en-US", { timeZone: "America/" + hotspot });
                                    localTime = new Date(localTime);
                                    var lt = localTime.toLocaleString();
                                    var hour = lt.slice(lt.indexOf(", ") + 2, lt.indexOf(":")) + lt.slice(-2);

                                    if (!subscribeTimes.includes(hour)) {
                                        dcUsersNo.push(doc.id);
                                    } else {
                                        dcUsersYes.push(doc.id);
                                        eval("users.doc('" + doc.id + "').update({'" + addr + "': '" + data + "'});");

                                        client.users.get(doc.id).send(message.content);
                                    }
                                }

                                if (l == querySnapshot.size) {
                                    log("Country: Successful");
                                    pass++;
                                    client.removeListener('message', listentome1);
                                    return doLocation();
                                }
                            });
                        }).catch(function (err) {
                            error(err);
                            e++;
                            client.removeListener('message', listentome1);
                            return log("Country: Unsuccessful");
                        });
                    }
                });
            }

            function doLocation() {
                var dlUsersNo = [];
                var dlUsersYes = [];

                users.get().then(function (querySnapshot) {
                    var l = 0;
                    querySnapshot.forEach(function (doc) {
                        l++;

                        var times = (doc.data().timesetCommands) ? doc.data().timesetCommands : null;
                        var locationTimes = (times && times.location) ? times.location.toString().split(",") : null;
                        var timezone = (doc.data().tz) ? doc.data().tz : null;

                        if (!locationTimes) {
                            dlUsersNo.push(doc.id);
                        } else {
                            switch (timezone) {
                                case "EDT", "EST", null:
                                    var hotspot = "New_York";
                                    break;
                                case "CDT":
                                    var hotspot = "Chicago";
                                    break;
                                case "MDT":
                                    var hotspot = "Salt_Lake_City";
                                    break;
                                case "MST":
                                    var hotspot = "Phoenix";
                                    break;
                                case "PDT":
                                    var hotspot = "Los_Angeles";
                                    break;
                                case "AKDT":
                                    var hotspot = "Anchorage";
                                    break;
                                case "HST":
                                    var hotspot = "Honolulu";
                                    break;
                                default:
                                    var hotspot = "New_York";
                            }

                            var localTime = new Date().toLocaleString("en-US", { timeZone: "America/" + hotspot });
                            localTime = new Date(localTime);
                            var lt = localTime.toLocaleString();
                            var hour = lt.slice(lt.indexOf(", ") + 2, lt.indexOf(":")) + lt.slice(-2);

                            if (!locationTimes.includes(hour)) {
                                dlUsersNo.push(doc.id);
                            } else {
                                var state = (doc.data().state) ? doc.data().state : null;
                                var county = (doc.data().county) ? doc.data().county : null;

                                if (state && county) {
                                    var location = county + " " + state;
                                } else if (state) {
                                    var location = state;
                                } else if (county) {
                                    var location = county;
                                } else {
                                    log("User " + doc.id + " has no location set.");
                                    var location = null;
                                }

                                if (location && !locations.includes(location)) {
                                    locations.push(location);

                                    var token = doc.id + Math.floor(100000 + Math.random() * 999999);
                                    msg.channel.send("!botcases " + location + " " + token);

                                    client.on('message', function locationsListen(message) {
                                        if (message.author.id == "692117206108209253" && message.channel.id == "696894398293737512" && message.content.includes(token) && !message.content.includes("!botcases")) {
                                            var data = message.content.replace(token + " ", "").toString();
                                            var matches = data.match(/\d+/g);
                                            locationsMatches[locations.indexOf(location)] = matches;

                                            var d = new Date();

                                            var month = (d.getMonth() + 1 < 10) ? ("0" + (d.getMonth() + 1).toString()) : (d.getMonth() + 1).toString();
                                            var day = (d.getDate() + 1 < 10) ? ("0" + (d.getDate() + 1).toString()) : (d.getDate() + 1).toString();
                                            var hour = (d.getHours() < 10) ? ("0" + (d.getHours().toString())) : d.getHours().toString();

                                            var addr = (location.replace(" ", "_") + "." + d.getFullYear().toString() + month + day + hour).toString();

                                            dlUsersYes.push(doc.id);
                                            eval("users.doc('" + doc.id + "').update({'" + addr + "': '" + data + "'});");

                                            client.users.get(doc.id).send(data);

                                            client.removeListener('message', locationsListen);
                                        }
                                    });
                                } else if (location && locations.includes(location)) {
                                    dlUsersYes.push(doc.id);
                                    log("Location " + location + " has already been queried, getting data for that location from stored memory.");
                                    var data = locationsMatches[locations.indexOf(location)];
                                    client.users.get(doc.id).send(data);
                                } else {
                                    error("Error occurred, location undefined.");
                                }
                            }
                        }

                        if (l == querySnapshot.size) {
                            log("Location: Successful");
                            pass++;
                            return doWatchlist();
                        }
                    });
                }).catch(function (err) {
                    error(err);
                    e++;
                    client.users.get('377934017548386307').send("Error occurred with activation location retrieval.");
                    return log("Location: Unuccessful");
                });
            }

            function doWatchlist() {
                var dwlUsersNo = [];
                var dwlUsersYes = [];
                
                users.get().then(function (querySnapshot) {
                    var l = 0;
                    querySnapshot.forEach(function (doc) {
                        l++;

                        var times = (doc.data().timesetCommands) ? doc.data().timesetCommands : null;
                        var watchlistTimes = (times && times.watchlist) ? times.watchlist.toString().split(",") : null;
                        var timezone = (doc.data().tz) ? doc.data().tz : null;

                        if (!watchlistTimes) {
                            dwlUsersNo.push(doc.id);
                        } else {
                            switch (timezone) {
                                case "EDT", "EST", null:
                                    var hotspot = "New_York";
                                    break;
                                case "CDT":
                                    var hotspot = "Chicago";
                                    break;
                                case "MDT":
                                    var hotspot = "Salt_Lake_City";
                                    break;
                                case "MST":
                                    var hotspot = "Phoenix";
                                    break;
                                case "PDT":
                                    var hotspot = "Los_Angeles";
                                    break;
                                case "AKDT":
                                    var hotspot = "Anchorage";
                                    break;
                                case "HST":
                                    var hotspot = "Honolulu";
                                    break;
                                default:
                                    var hotspot = "New_York";
                            }

                            var localTime = new Date().toLocaleString("en-US", { timeZone: "America/" + hotspot });
                            localTime = new Date(localTime);
                            var lt = localTime.toLocaleString();
                            var hour = lt.slice(lt.indexOf(", ") + 2, lt.indexOf(":")) + lt.slice(-2);

                            if (!watchlistTimes.includes(hour)) {
                                dwlUsersNo.push(doc.id);
                            } else {
                                var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;

                                if (watchlist) {
                                    for (i = 0; i < watchlist.length; i++) {
                                        var location = watchlist[i].toString();

                                        if (locations.indexOf(location) == -1) {
                                            locations.push(location);

                                            var token = doc.id + Math.floor(100000 + Math.random() * 999999);
                                            msg.channel.send("!botcases " + location + " " + token);

                                            client.once('message', function watchlistListen(message) {
                                                if (message.author.id == "692117206108209253" && message.channel.id == "696894398293737512" && message.content.includes(token) && !message.content.includes("!botcases")) {

                                                    var data = message.content.replace(token + " ", "").toString();
                                                    var matches = data.match(/\d+/g);
                                                    locationsMatches[locations.indexOf(location)] = matches;

                                                    var d = new Date();

                                                    var month = (d.getMonth() + 1 < 10) ? ("0" + (d.getMonth() + 1).toString()) : (d.getMonth() + 1).toString();
                                                    var day = (d.getDate() + 1 < 10) ? ("0" + (d.getDate() + 1).toString()) : (d.getDate() + 1).toString();
                                                    var hour = (d.getHours() < 10) ? ("0" + (d.getHours().toString())) : d.getHours().toString();

                                                    var addr = (location.replace(" ", "_") + "." + d.getFullYear().toString() + month + day + hour).toString();

                                                    dwlUsersYes.push(doc.id);
                                                    eval("users.doc('" + doc.id + "').update({'" + addr + "': '" + data + "'});");
                                                    client.users.get(doc.id).send(data);

                                                    client.removeListener('message', watchlistListen);
                                                }
                                            });
                                        } else {
                                            dwlUsersYes.push(doc.id);
                                            log("Location " + location + " has already been queried, getting data for that location from stored memory.");
                                            var data = locationsMatches[locations.indexOf(location)];

                                            if (!locationsMatches) {
                                                console.log("this ain't it chief");
                                            } else if (data) {
                                                console.log(data);
                                                client.users.get(doc.id).send(data);
                                            } else {
                                                console.log(locationsMatches, "Error occurred here");
                                            }
                                        }
                                    }
                                } else if (!watchlist) {
                                    log("User " + doc.id + " does not have a watchlist");
                                }
                            }
                        }

                        if (l == querySnapshot.size) {
                            log("Watchlist: Successful");
                            pass++;
                            return;
                        }
                    });
                }).catch(function (err) {
                    error(err);
                    e++;
                    client.users.get('377934017548386307').send("Error occurred with activation watchlist retrieval.");
                    return log("Watchlist: Unsuccessful");
                });
            }

            doWorst();

            function finish() {
                let endThisAll = new Promise((resolve) => {

                    var mlUsersSuccess = [];
                    var mlUsersFailure = [];

                    db.collection('mailinglist').get().then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            var emails = (doc.data().emails) ? doc.data().emails : null;
                            if (!emails) {
                                return log("No emails in the document with id " + doc.id);
                            } else {
                                emails.forEach(function (value, key) {
                                    auth.sendPasswordResetEmail(value).then(function () {
                                        mlUsersSuccess.push(doc.id);
                                    }).catch(function (err) {
                                        mlUsersFailure.push(doc.id);
                                        error(err);
                                        e++;
                                    });
                                });
                            }
                        });
                    }).then(function () {
                        return log("Emails: Successful");
                    }).catch(function (err) {
                        error(err);
                        e++;
                        client.users.get('377934017548386307').send("Error occurred with activation mailing list delivery.");
                        return log("Emails: Unsuccessful");

                    });

                    resolve(true);

                }).then(function (result) {
                    if (pass == 4) {
                        log("Finished updating!");

                        if (result && e == 0) {
                            client.users.get('377934017548386307').send("Finished updating everyone successfully!");
                            log("Finished updating everyone! No errors occurred!");
                        } else if (result && e != 0) {
                            client.users.get('377934017548386307').send("Finished updating everyone with " + e + " errors.");
                            log("Finished updating everyone! " + e + " errors were found.");
                        }
                        return log("---------------------------");
                    } else {
                        error("Interesting...");
                    }
                });
            }
            
            break;
        case "international": case "intl": case "global": case "worldwide":
            if (args.length == 0) {
                return msg.reply("To use the international command, please follow the paradigm:\n" +
                    "```!global <country (2- or 3-character abbreviation)>```");
            } else if (countries2.has(args[0].toUpperCase())) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        text = this.responseText;
                        text = JSON.parse(text);

                        var confirmed = text["confirmed"]["value"];
                        var deaths = text["deaths"]["value"];
                        var recovered = text["recovered"]["value"];

                        return msg.reply(`The country of ${countries2.get(args[0].toUpperCase())} has ${confirmed} cases, ${deaths} deaths, and ${recovered} recovered cases!`);
                    }
                };

                xhttp.open("GET", "https://covid19.mathdro.id/api/countries/" + args[0].toUpperCase(), true);
                xhttp.send();
            } else if (countries3.has(args[0].toUpperCase())) {
                var c = Object.keys(countriesObject3).indexOf(args[0].toUpperCase());
                var code = Object.keys(countriesObject2)[c];

                if (countries3.has(args[0].toUpperCase())) {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            text = this.responseText;
                            text = JSON.parse(text);

                            var confirmed = text["confirmed"]["value"];
                            var deaths = text["deaths"]["value"];
                            var recovered = text["recovered"]["value"];

                            return msg.reply(`The country of ${countries2.get(code)} has ${confirmed} cases, ${deaths} deaths, and ${recovered} recovered cases!`);
                        }
                    };

                    xhttp.open("GET", "https://covid19.mathdro.id/api/countries/" + code, true);
                    xhttp.send();
                } else {
                    return msg.reply("Please enter a valid 2- or 3-character country code!");
                }
            } else {
                return msg.reply("Please enter a valid 2- or 3-character country code!");
            }
            break;
        case "mycases":
            userDoc.get().then(function (doc) {
                if (doc.exists) {
                    var state = doc.data().state;
                    var county = doc.data().county;

                    if (county) {
                        var location = county + " " + state;
                    } else {
                        var location = state;
                    }
                        
                    var channels = ["695838084687986738", "696893994247913492", "696894015324291194", "696894101232287785", "696894131972210708", "696894159314747392",
                        "696894185755902002", "696894213194776636", "696894242894774282", "696894279720894475", "696894305058422794", "696894326994632784"];
                    var seed = Math.floor(Math.random() * 12);
                    var channelID = channels[seed];

                    var token = Math.floor(100000 + Math.random() * 999999);

                    client.channels.get(channelID).send("!botcases " + location + " " + token);

                    client.on('message', function usercasesListening(message) {
                        if (message.author.id == "692117206108209253" && message.channel.id == channelID && message.content.includes(token) && !message.content.includes("!botcases")) {
                            var words = message.content.split(" ");

                            if (county) {
                                msg.reply(`The ${words[2] + " " + words[3] + " " + words[4]} has ${words[6]} cases and ${words[8]} deaths!`);
                            } else {
                                var xhttp = new XMLHttpRequest();
                                xhttp.onreadystatechange = function () {
                                    if (this.readyState == 4 && this.status == 200) {
                                        text = this.responseText;
                                        text = JSON.parse(text);
                                        text = text.sort(function (a, b) {
                                            return a[3] - b[3];
                                        });

                                        var s = stateAbbrv.indexOf(state);
                                        var population = text[s + 1][1];
                                        var rate = words[6]/population;

                                        if (!Number.isNaN(rate)) {
                                            msg.reply(`The state of ${words[4]} has ${words[6]} cases and ${words[8]} deaths, with an infection rate of ${(rate * 100).toFixed(2)}%!`);
                                        } else {
                                            error("Rate for mycases command is not a number!");
                                            return msg.reply("Error occurred! Try again later!");
                                        }
                                    }
                                };

                                xhttp.open("GET", "https://api.census.gov/data/2019/pep/population?get=DATE_DESC,POP,NAME&for=state", true);
                                xhttp.send();
                            }

                            return client.removeListener('message', usercasesListening);
                        }
                    });
                } else {
                    msg.reply("You don't have a location set! Use !location or !help to see how to use the location command.");
                }
            }).catch(function (err) {
                error(err);
                msg.reply("Error occurred. Please try again later.");
            });
            break;
        case "rate":
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    text = this.responseText;
                    text = JSON.parse(text);
                    text = text.sort(function (a, b) {
                        return a[3] - b[3];
                    });

                    var channels = ["695838084687986738", "696893994247913492", "696894015324291194", "696894101232287785", "696894131972210708", "696894159314747392",
                        "696894185755902002", "696894213194776636", "696894242894774282", "696894279720894475", "696894305058422794", "696894326994632784"];
                    var seed = Math.floor(Math.random() * 12);
                    var channelID = channels[seed];

                    if (args.length == 0 || args.includes("US")) {
                        var population = 331209314;
                        var cmd = "!cases";
                    } else {
                        var state = args[0].toUpperCase();
                        if (!stateAbbrv.includes(state)) {
                            return msg.reply("Sorry, couldn't figure out what state '" + state + "' is. Please make sure you have entered an abbreviation and not the full name!");
                        }

                        var s = stateAbbrv.indexOf(state);
                        var population = text[s + 1][1];

                        var token = Math.floor(100000 + Math.random() * 999999);
                        var cmd = "!botcases " + state + " " + token;
                    }

                    client.channels.get(channelID).send(cmd);

                    client.on('message', function usercasesListening(message) {
                        if (message.author.id == "692117206108209253" && message.channel.id == channelID && !message.content.includes(cmd)) {
                            if ((cmd == "!cases" && !message.content.includes(token)) || (cmd != "!cases" && message.content.includes(token))) {
                                var data = message.content.replace(token + " ", " ").toString();
                                var matches = data.match(/\d+/g);
                                var cases = matches[0];

                                if (args.length == 0 || args.includes("US")) {
                                    var pre = "the US";
                                } else {
                                    var pre = "the state of " + states[s];
                                }

                                var rate = ((cases / population) * 100).toFixed(2);

                                msg.reply(`The infection rate for ${pre} is ${rate}% (${cases} cases out of a population of ${population}).`);

                                return client.removeListener('message', usercasesListening);
                            }
                        }
                    });
                }
            };

            xhttp.open("GET", "https://api.census.gov/data/2019/pep/population?get=DATE_DESC,POP,NAME&for=state", true);
            xhttp.send();
            break;
        case "website", "site":
            const websiteEmbed = {
                title: 'CovidBot19 Website',
                url: 'https://covidbot19.web.app',
                description: 'Click the link to go to our website! (WIP)',
            };

            msg.channel.send({ embed: websiteEmbed });
            break;
        case "discord":
            return;
            const discordEmbed = {
                title: 'CovidBot19 Discord Server',
                url: 'https://discord.gg/Cg7E8ms',
                description: 'Click the link to join our Discord Server!',
            };

            msg.channel.send({ embed: discordEmbed });
            break;
        case "restrictions":
            if (!args.length || args.length != 1) {
                return msg.reply("To use the restrictions command, please follow the paradigm:\n" +
                    "```!restrictions <state (abbreviation)> ```Note: At this moment, only states in the US is supported.");
            } else {
                var i = stateNumbers.indexOf(args[0].toUpperCase());

                var text = "";
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        text = this.responseText;
                        text = JSON.parse(text);
                        var state = JSON.stringify(text.features[i].attributes["NAME"]);
                        var general = JSON.stringify(text.features[i].attributes["Statewide_Limits_on_Gatherings_"]);
                        var school = JSON.stringify(text.features[i].attributes["Statewide_School_Closures"]);
                        msg.reply("State of " + state.substring(1, state.length - 1)
                            + ":\nLockdown Order? - " + general.substring(1, general.length - 1) + "\nSchool Closed? - " + school.substring(1, school.length - 1) + "\n Dislaimer: Data may be out of date for some places; check your DOH site to see more accurate data.");
                    }
                };
                xhttp.open("GET", "https://services3.arcgis.com/EvmgEO8WtpouUbyD/arcgis/rest/services/COVID19_State_Actions_Download/FeatureServer/0/query?where=1%3D1&outFields=STUSPS,NAME,Statewide_School_Closures,Statewide_Limits_on_Gatherings_&returnGeometry=false&outSR=4326&f=json", true);
                xhttp.send();
            }
            break;
        case "news": case "articles":
            var url = 'http://newsapi.org/v2/top-headlines?' +
                'q=COVID&category=health&country=US&' +
                'sortBy=popularity&' +
                'apiKey=e55f2d04dbae45d4bc5c253924f6d3ed';

            var xhttp = new XMLHttpRequest();
            var articles = [];
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    articles = JSON.parse(this.responseText).articles;

                    var newsEmbed = new Discord.RichEmbed().setTitle("Top Headlines for COVID-19")
                        .setColor("#C70039")
                        .setFooter("API: newsapi.org");

                    for (i = 0; i < 5; i++) {
                        var dateArray = new Date(new Date(articles[0]["publishedAt"]) - new Date().getTimezoneOffset()).toString().split(' ')
                        var date = dateArray[1] + " " + dateArray[2] + " " + dateArray[3];

                        var title = articles[i]["title"];
                        var desc = articles[i]["description"].substr(0, 101) + "...";
                        var url = articles[i]["url"];
                        var source = articles[i]["source"]["name"] + " | " + date;

                        newsEmbed.addField(title, desc + " (" + source + ") | [Open article](" + url + ")");
                    }

                    msg.channel.send({ embed: newsEmbed });
                }
            };

            xhttp.open("GET", url, true);
            xhttp.send();
            break;
        case "suggest":
            if (!args.length) {
                return msg.reply("To use the suggest command, please follow the paradigm:\n" +
                    "```!suggest <recommendation (max length: 400 characters)> ```Note: Our developers are humans and can't implement every feature you suggest. " +
                    "If you ");
            } else {
            }
            break;
        case "help":
            const helpEmbed = new Discord.RichEmbed()
                .setTitle("Command List")
                .setColor('#C70039')
                .setThumbnail("https://www.genengnews.com/wp-content/uploads/2020/02/Getty_185760322_Coronavirus.jpg")
                .setURL("https://covidbot19.web.app")
                .addField("Signup",
                    "`!signup (no args)` - saves your Discord account so you can access even better features like the watchlist and subscriptions.\n"
                )
                .addField("ID",
                    "`!id (no args)` - retrieves your Discord ID; useful on our website to connect / sign in to a Discord account.\n"
                )
                .addField("Cases (US-only)",
                    "`!cases <location (county, state, country)>` - sends number of cases at the specified level of data.\n"
                )
                .addField("Global (International Data)",
                    "`!global <country (2- or 3-character abbreviation)>` - sends number of cases, deaths, and recovered cases for the country specified."
                )
                .addField("Mycases (US-only)",
                    "`!mycases (no args)` - sends number of cases in your location (use !location to set a location).\n"
                )
                .addField("Graph (US-only)",
                    "`!graph <location (county + state, state, country)>` - sends a graph of the cases and deaths for the given location."
                )
                .addField("Restrictions",
                    "`!restrictions <state (abbreviation)>` - sends the general and school restrictions at the state level.\n"
                )
                .addField("News",
                    "!news or !articles (no args) - returns the top 5 headlines in the US related to COVID-19.\n"
                )
                .addField("Location",
                    "`!location <county (optional)> <state (abbreviation)>` - saves your location in case you want to see local data later.\n"
                )
                .addField("Subscribe",
                    "`!subscribe <level (county, state, country)>` - subscribes to the specified level of data, allowing direct messages from the bot for new cases." +
                    "Note: this command is not for specific data, it only subscribes to the level of data regardless of location.\n"
                )
                .addField("Unsubscribe",
                    "`!unsubscribe <level (county, state, country)>` - subscribes to the specified level of data, allowing direct messages from the bot for new cases.\n"
                )
                .addField("Timeset",
                    "`!timeset <level (county, state, country)>` - subscribes to the specified level of data, allowing direct messages from the bot for new cases.\n"
                )
                .addField("Watchlist",
                    "`!watchlist <view (no args)/add/remove/clear (no args)> <county (optional)> <state (abbreviation)>` - adds a specific location to your watchlist.\n"
                )
                .addField("Website",
                    "`!site (no args)` - Sends our website URL.\n"
                )
                .addField("Discord Server",
                    "`!discord (no args)` - Sends the invite link to our Discord Server.\n"
                )
                .setFooter('Data Source: Arcgis | DM Rasmit#3525 if you have any difficulties');
            msg.channel.send({ embed: helpEmbed });
            break;
        case "mimic":
            if (id != "377934017548386307" && id != "181965297249550336" && id != "527873651748634624") {
                msg.reply("You can't use that command! You're not cool enough! Go do your homework!");
                return log("User " + id + " attempted to use !mimic without permission.");
            } else {
                if (msg.content.slice(7).includes("!")) {
                    var commandToMimic = msg.content.slice(8);
                } else {
                    var commandToMimic = msg.content.slice(7);
                }

                if (msg.content.includes("channel=")) {
                    var cid = msg.content.slice(msg.content.indexOf("channel=") + 8);
                    if (cid.length == 21 && /<#\d{18}>/g.test(cid)) {
                        var channelToMimic = client.channels.find('name', cid);
                        log(channelToMimic);
                    } else {
                        return msg.reply("Looks like you didn't enter the channel correctly! Use `\#<channel-name>` to send to a specific channel.\n You entered: " + cid);
                    }
                } else {
                    var channelToMimic = msg.channel;
                }
                
                return channelToMimic.send("!" + commandToMimic);
            }
            break;
        case "test":
            // if (id != "377934017548386307" && id != "181965297249550336" && id != "527873651748634624" && id != "692117206108209253") {
            //     msg.reply("You can't use that command! You're not smart enough! Go home punk!");
            //     return log("User " + id + " attempted to use !test without permission.");
            // } else if (msg.channel.id != "696894398293737512") {
            //     return msg.reply("Hey! You shouldn't be doing that nasty stuff in public! Do it somewhere privately!");
            // }
                
            // var locations = [];
            // var locationsMatches = [];

            // var dwlUsersNo = [];
            // var dwlUsersYes = [];

            // users.get().then(function (querySnapshot) {
            //     var l = 0;
            //     querySnapshot.forEach(function (doc) {
            //         l++;

            //         var times = (doc.data().timesetCommands) ? doc.data().timesetCommands : null;
            //         var watchlistTimes = (times && times.watchlist) ? times.watchlist.toString().split(",") : null;
            //         var timezone = (doc.data().tz) ? doc.data().tz : null;

            //         if (!watchlistTimes) {
            //             dwlUsersNo.push(doc.id);
            //         } else {
            //             switch (timezone) {
            //                 case "EDT", "EST", null:
            //                     var hotspot = "New_York";
            //                     break;
            //                 case "CDT":
            //                     var hotspot = "Chicago";
            //                     break;
            //                 case "MDT":
            //                     var hotspot = "Salt_Lake_City";
            //                     break;
            //                 case "MST":
            //                     var hotspot = "Phoenix";
            //                     break;
            //                 case "PDT":
            //                     var hotspot = "Los_Angeles";
            //                     break;
            //                 case "AKDT":
            //                     var hotspot = "Anchorage";
            //                     break;
            //                 case "HST":
            //                     var hotspot = "Honolulu";
            //                     break;
            //                 default:
            //                     var hotspot = "New_York";
            //             }

            //             var localTime = new Date().toLocaleString("en-US", { timeZone: "America/" + hotspot });
            //             localTime = new Date(localTime);
            //             var lt = localTime.toLocaleString();
            //             var hour = lt.slice(lt.indexOf(", ") + 2, lt.indexOf(":")) + lt.slice(-2);

            //             if (!watchlistTimes.includes(hour)) {
            //                 dwlUsersNo.push(doc.id);
            //             } else {
            //                 var watchlist = (doc.data().watchlist) ? doc.data().watchlist : null;

            //                 if (watchlist) {
            //                     for (i = 0; i < watchlist.length; i++) {
            //                         var location = watchlist[i].toString();

            //                         if (locations.indexOf(location) == -1) {
            //                             locations.push(location);

            //                             var token = doc.id + Math.floor(100000 + Math.random() * 999999);
            //                             msg.channel.send("!botcases " + location + " " + token);

            //                             console.log(location);

            //                             client.once('message', function watchlistListen(message) {
            //                                 if (message.author.id == "692117206108209253" && message.channel.id == "696894398293737512" && message.content.includes(token) && !message.content.includes("!botcases")) {
            //                                     setTimeout(function () { console.log(message.content); }, 1000);

            //                                     console.log(location);

            //                                     var data = message.content.replace(token + " ", "").toString();
            //                                     var matches = data.match(/\d+/g);
            //                                     locationsMatches[locations.indexOf(location)] = matches;

            //                                     var d = new Date();

            //                                     var month = (d.getMonth() + 1 < 10) ? ("0" + (d.getMonth() + 1).toString()) : (d.getMonth() + 1).toString();
            //                                     var day = (d.getDate() + 1 < 10) ? ("0" + (d.getDate() + 1).toString()) : (d.getDate() + 1).toString();
            //                                     var hour = (d.getHours() < 10) ? ("0" + (d.getHours().toString())) : d.getHours().toString();

            //                                     var addr = (location.replace(" ", "_") + "." + d.getFullYear().toString() + month + day + hour).toString();

            //                                     dwlUsersYes.push(doc.id);
            //                                     eval("users.doc('" + doc.id + "').update({'" + addr + "': '" + data + "'});");
            //                                     client.users.get(doc.id).send(data);

            //                                     client.removeListener('message', watchlistListen);
            //                                 }
            //                             });
            //                         } else {
            //                             dwlUsersYes.push(doc.id);
            //                             log("Location " + location + " has already been queried, getting data for that location from stored memory.");
            //                             var data = locationsMatches[locations.indexOf(location)];

            //                             if (!locationsMatches) {
            //                                 console.log("this ain't it chief");
            //                             } else if (data) {
            //                                 console.log(data);
            //                                 client.users.get(doc.id).send(data);
            //                             } else {
            //                                 console.log(locationsMatches, "Error occurred here");
            //                             }
            //                         }
            //                     }
            //                 } else if (!watchlist) {
            //                     log("User " + doc.id + " does not have a watchlist");
            //                 }
            //             }
            //         }

            //         if (l == querySnapshot.size) {
            //             log("Watchlist: Successful");
            //             pass++;
            //             return;
            //         }
            //     });
            // }).catch(function (err) {
            //     error(err);
            //     e++;
            //     client.users.get('377934017548386307').send("Error occurred with activation watchlist retrieval.");
            //     return log("Watchlist: Unsuccessful");
            // });
            break;
        default:
            break;
    }
})
// Discord End
