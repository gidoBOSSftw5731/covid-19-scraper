importScripts("https://www.gstatic.com/firebasejs/7.13.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.13.1/firebase-messaging.js");

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    const title = 'Hello World';
    const options = {
        body: payload.data.status
    };
    return self.ServiceWorkerRegistration.showNotification(title, options); 
});
