// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { 
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { 
  getDatabase 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "jaidens-web-designs.firebaseapp.com",
  projectId: "jaidens-web-designs",
  storageBucket: "jaidens-web-designs.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://jaidens-web-designs.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Authentication State Management
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  updateUIBasedOnAuth();
  
  if (user) {
    console.log("User logged in:", user.email);
    // Load user data from Firestore
    loadUserData(user.uid);
    // Show user link in nav
    const userLink = document.getElementById('userLink');
    const authLink = document.getElementById('authLink');
    if (userLink) userLink.style.display = 'block';
    if (authLink) authLink.style.display = 'none';
  } else {
    console.log("User logged out");
    // Hide user link in nav
    const userLink = document.getElementById('userLink');
    const authLink = document.getElementById('authLink');
    if (userLink) userLink.style.display = 'none';
    if (authLink) authLink.style.display = 'block';
  }
});

// Update UI based on authentication state
function updateUIBasedOnAuth() {
  const authLink = document.querySelector('.nav-link.auth-link');
  
  if (currentUser && authLink) {
    authLink.textContent = currentUser.email.split('@')[0];
    authLink.href = '/pages/dashboard.html';
  } else if (authLink) {
    authLink.textContent = 'Sign In';
    authLink.href = '/pages/signin.html';
  }
}

// Load user data from Firestore
async function loadUserData(uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

// Get current user
export function getCurrentUser() {
  return currentUser;
}

// Check if user is authenticated
export function isAuthenticated() {
  return currentUser !== null;
}

// Protect pages that require authentication
export function checkAuthenticationForPage() {
  const protectedPages = [
    '/pages/dashboard.html',
    '/pages/chat.html'
  ];
  
  const currentPage = window.location.pathname;
  
  if (protectedPages.some(page => currentPage.includes(page))) {
    if (!isAuthenticated()) {
      // Redirect to sign-in after a short delay
      setTimeout(() => {
        window.location.href = '/pages/signin.html?redirect=' + encodeURIComponent(currentPage);
      }, 1000);
    }
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuthenticationForPage();
});

console.log("Firebase initialized successfully");
