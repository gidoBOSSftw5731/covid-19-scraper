messaging.requestPermission().then(function () {
    console.log('Permission granted');
    return messaging.getToken();
}).then(function (token) {
    console.log(token);
}).catch(function (err) {
    console.log('Error occurred.');
});

messaging.onMessage(function (payload) {
    console.log('onMessage: ', payload);
});