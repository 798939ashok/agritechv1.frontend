// ============================================================
// FIREBASE NOTIFICATION START
// Firebase Cloud Messaging Service Worker
// This file must be at the public root for FCM to work.
// ============================================================
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: self.FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage(function (payload) {
  console.log('[AgriSense] Background message received:', payload);
  const { title, body, icon } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: icon || '/logo192.png',
    badge: '/logo192.png',
    tag: 'agrisense-notification',
  });
});
// FIREBASE NOTIFICATION END
