// Firebase Cloud Messaging service worker
// This file must be in the public/ folder to be served at the root path.
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCFyINywyRpDI-hDDsxmqxxkVijVcHatZE",
  authDomain: "campus-cart-6a53d.firebaseapp.com",
  projectId: "campus-cart-6a53d",
  storageBucket: "campus-cart-6a53d.firebasestorage.app",
  messagingSenderId: "219325576363",
  appId: "1:219325576363:web:6fac57c9e0e86027abf3ee",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: icon || "/logo.svg",
    badge: "/logo.svg",
  });
});
