importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAGAmflgfYcwOWXtLOxdhBdamwbfo8iKt0",
  authDomain: "orvex-33cd6.firebaseapp.com",
  projectId: "orvex-33cd6",
  storageBucket: "orvex-33cd6.firebasestorage.app",
  messagingSenderId: "317044395277",
  appId: "1:317044395277:web:fc1ef94cd7eba744ecb444",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Background Message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
