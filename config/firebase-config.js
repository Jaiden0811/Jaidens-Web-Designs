// Firebase Configuration for Frontend
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDemoAPIKey123456789",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "jaidens-web-designs.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "jaidens-web-designs",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "jaidens-web-designs.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456789",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://jaidens-web-designs.firebaseio.com"
};

// Initialize Firebase (this will be done in frontend JavaScript)
if (typeof window !== 'undefined') {
  console.log('Firebase config loaded for frontend');
}
