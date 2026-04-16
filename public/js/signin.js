// Sign-In Logic
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { auth } from '/js/firebase-init.js';

const googleProvider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
  const signInForm = document.getElementById('signInForm');
  const googleSignInBtn = document.getElementById('googleSignIn');
  
  if (signInForm) {
    signInForm.addEventListener('submit', handleSignIn);
  }
  
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', handleGoogleSignIn);
  }
});

async function handleSignIn(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('authMessage');
  
  if (!email || !password) {
    showSignInMessage('Please fill in all fields', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showSignInMessage('Please enter a valid email address', 'error');
    return;
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    showSignInMessage('Signing in...', 'success');
    
    setTimeout(() => {
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      window.location.href = redirect || '/pages/dashboard.html';
    }, 1500);
  } catch (error) {
    console.error('Sign in error:', error);
    let errorMessage = 'An error occurred. Please try again.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'Email not found. Please sign up first.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled.';
    }
    
    showSignInMessage(errorMessage, 'error');
  }
}

async function handleGoogleSignIn(e) {
  e.preventDefault();
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    showSignInMessage('Signed in successfully!', 'success');
    
    setTimeout(() => {
      window.location.href = '/pages/dashboard.html';
    }, 1500);
  } catch (error) {
    console.error('Google sign-in error:', error);
    showSignInMessage('Google sign-in failed. Please try again.', 'error');
  }
}

function showSignInMessage(message, type) {
  const messageDiv = document.getElementById('authMessage');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `auth-message ${type}`;
    messageDiv.style.display = 'block';
  }
}

console.log('Sign-in script loaded');
