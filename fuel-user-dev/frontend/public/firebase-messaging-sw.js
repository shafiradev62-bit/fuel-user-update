/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

const cfg = {
  apiKey: self.FIREBASE_API_KEY,
  authDomain: self.FIREBASE_AUTH_DOMAIN,
  projectId: self.FIREBASE_PROJECT_ID,
  storageBucket: self.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID,
  appId: self.FIREBASE_APP_ID
};

try {
  if (cfg.apiKey && cfg.messagingSenderId && cfg.appId) {
    firebase.initializeApp(cfg);
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage(function(payload) {
      const notificationTitle = payload.notification?.title || 'FuelFriendly';
      const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/vite.svg'
      };
      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
} catch (e) {}