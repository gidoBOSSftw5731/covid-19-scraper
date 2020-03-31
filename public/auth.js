function signIn() {
    if (firebase.auth().currentUser == null){
        console.log(firebase.auth().currentUser);
        togglepsi();
    } else {
        firebase.auth().signOut();
        $('#signin').text("Sign In");
        console.log(document.getElementById("signin").innerHTML);
        console.log(firebase.auth().currentUser);
    }
};

function eToggleSignIn() {
    var password = document.getElementById('password').value;
    var email = document.getElementById('emailemail').value;
    if (email.length < 8) {
        alert('Please enter a longer email.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a longer password.');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        firebase.auth().onAuthStateChanged(function (user) {
            display("email");
            pageLoad(true);
        });
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
};

// Google Login
function gToggleSignIn() {
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function (result) {
            var user = result.user;
            var uid = user.uid.toString();

            firebase.auth().onAuthStateChanged(function (user) {
                if (user != null) {
                    user.providerData.forEach(function (profile) {
                        var username = profile.displayName.toString();
                        var email = profile.email.toString();
                        var userDataEmails = emails.doc(username);
                        var userDataUsers = users.doc(uid);

                        userDataEmails.get().then(function (doc) {
                            if (!doc.exists) {
                                userDataEmails.set({
                                    email: email,
                                    uid: uid,
                                }).then(function () {
                                    console.log("Document successfully written!");
                                }).catch(function (error) {
                                    console.error("Error writing document: ", error);
                                });
                            } else {
                                console.log("Emails doc already exists, skipped writing.");
                            }
                        }).then(function () {
                            userDataUsers.get().then(function (doc) {
                                if (!doc.exists) {
                                    userDataUsers.set({
                                        displayName: username,
                                        email: email,
                                    }).then(function () {
                                        console.log("Document successfully written!");
                                    }).catch(function (error) {
                                        console.log("Error writing document: ", error);
                                    });
                                } else {
                                    console.log("Users doc already exists, skipped writing.");
                                }
                            });
                        });
                    });

                    togglepsi();
                    pageLoad(true);
                };
            });
        }).catch(function (error) {
            var errorCode = error.code;
            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different method for that email. If you want to merge your Google account with an Email/Password account, go to the Account page.');
            } else {
                console.log(error);
            }
        });
    } else {
        alert("There is already a user signed in, please sign out before proceeding.");
    }
};
// Google Login End

// Signup
function handleSignUp() {
    var permusername = document.getElementById('suusername').value.toString();
    var permemail = document.getElementById('suemail').value.toString();
    var permpassword = document.getElementById('supassword').value.toString();
    
    if (permusername.length < 3) {
        alert('Please enter a longer username.');
        return;
    }
    if (permemail.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (permpassword.length < 4) {
        alert('Please enter a password.');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(permemail, permpassword).then(function () {
        firebase.auth().signInWithEmailAndPassword(permemail, permpassword).catch(function (error) {
            console.log(error);
        });

        firebase.auth().onAuthStateChanged(function (user) {
            emails.doc(permusername).set({
                email: permemail,
                uid: user.uid,
            }).then(function () {
                console.log("Document successfully written!");
            }).catch(function (error) {
                console.error("Error writing document: ", error);
            });

            users.doc(user.uid).set({
                displayName: permusername,
                email: permemail,
            }).then(function () {
                console.log("Document successfully written!");
            }).catch(function (error) {
                console.error("Error writing document: ", error);
            });

            user.updateProfile({
                displayName: permusername,
            }).then(function () {
                console.log(user.displayName);
            }).catch(function (error) {
                console.log(error);
                console.log(user.displayName);
            });
            display('signup');
            pageLoad(true);
        });
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
};
// Signup End

// Discord Token Generate
function discordTokenGenerate(use) {
    var id = document.getElementById(use + "discordID").value;
    var token = Math.floor(100000 + Math.random() * 900000);
    if (use == "C") {
        var method = "connect your Discord account to a regular site account";
    } else {
        var method = "authenticate with Discord";
    }
    
    client.fetchUser(id, false).then(user => {
        user.send("Use this token: " + token + " to " + method + " on https://covidbot19.web.app !");
    });

    client.login(process.env.BOT_TOKEN);
}
// Discord Token Generate End

// Discord Auth
function discordAuth() {
    var dID = document.getElementById('AdiscordID');

    if (dID) {
        users.doc(dAuthToken).set({
            id: dAuthToken
        }).then(function () {
            console.log("Document successfully written!");
            display('discordAuth');
            pageLoad(true);
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });
    }
};

// Connect Discord
function discordConnect() {
    if (user) {
        var dID = document.getElementById('AdiscordID');
        var discordUserDoc = users.doc(dID);
        var siteUserDoc = users.doc(displayName);

        discordUserDoc.get().then(function (doc) {
            if (!doc.exists) {
                if (confirm("You don't have an account registered with us on Discord yet! Would you like to register now?")) {
                    var discordUserData = doc.data();
                    siteUserDoc.get().then(function (doc) {
                        doc.set(discordUserData, { merge: true });
                    });
                }
            } else {
                var discordUserData = doc.data();
                siteUserDoc.get().then(function (doc) {
                    doc.set(discordUserData, { merge: true });
                }).then(function () {
                    alert('Successfully merged your accounts! You should receive a DM on Discord confirming this. If not, please contact a developer.');
                    display('discordConnect');
                    pageLoad(true);
                }).catch(function (error) {
                    console.error("Error writing document: ", error);
                });
            }
        });
    } else {
        alert("Oh no! It looks like you're not signed in but somehow seeing this! That shouldn't be happening! Sign in and try again!");
    }
};
// Connect Discord End

// Password Reset
function sendPasswordReset() {
    var email = document.getElementById('premail').value;
    
    if (email) {
        firebase.auth().sendPasswordResetEmail(email).then(function () {
            alert('Password Reset Email Sent!');
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/invalid-email') {
                alert(errorMessage);
            } else if (errorCode == 'auth/user-not-found') {
                alert(errorMessage);
            }
            console.log(error);
        });
    } else {
        alert("Please enter an email.");
    }
};
// Password Reset End