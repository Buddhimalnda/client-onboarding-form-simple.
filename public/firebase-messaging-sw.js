// firebase-messaging-sw.js
// Service workers need to use importScripts instead of ES modules
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// Initialize Firebase with your configuration
// We need to include the config directly in the service worker
// as it can't access environment variables
const firebaseConfig = {
  apiKey: "AIzaSyA99Y8ZvsQY82u1KiTSBNEhkEvPwKLoOiU", // Replace with your actual values or use self.__FIREBASE_CONFIG__
  authDomain: "fule-station-dev.firebaseapp.com",
  databaseURL: "https://fule-station-dev-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "fule-station-dev",
  storageBucket: "fule-station-dev.firebasestorage.app",
  messagingSenderId: "424922571995",
  appId: "1:424922571995:web:8ccbefd5834784ad5358fe",
};

// Initialize Firebase in the service worker context
firebase.initializeApp(firebaseConfig);

// Get Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Extract notification data
  // payload.fcmOptions?.link comes from our backend API route handler
  // payload.data.link comes from the Firebase Console where link is the 'key'
  const link = payload.fcmOptions?.link || payload.data?.link;

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png", // Make sure the path is correct
    badge: "/badge-icon.png",
    data: { url: link || '/' },
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", function (event) {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  // This checks if the client is already open and if it is, it focuses on the tab
  // If it is not open, it opens a new tab with the URL passed in the notification payload
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        const url = event.notification.data.url;

        if (!url) return;

        // Try to find an existing window/tab to focus
        for (const client of clientList) {
          // Check if the client URL matches or contains the notification URL
          if ((client.url === url || client.url.includes(url)) && "focus" in client) {
            return client.focus();
          }
        }

        // If no matching client found, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});