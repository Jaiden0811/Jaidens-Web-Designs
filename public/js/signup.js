// Sign-Up Logic
import { 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { auth, db } from '/js/firebase-init.js';

const googleProvider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
  const signUpForm = document.getElementById('signUpForm');
  const googleSignUpBtn = document.getElementById('googleSignUp');
  
  if (signUpForm) {
    signUpForm.addEventListener('submit', handleSignUp);
  }
  
  if (googleSignUpBtn) {
    googleSignUpBtn.addEventListener('click', handleGoogleSignUp);
  }
});

async function handleSignUp(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const company = document.getElementById('company').value;
  const terms = document.querySelector('input[name="terms"]').checked;
  
  // Validation
  if (!fullName || !email || !password || !confirmPassword) {
    showSignUpMessage('Please fill in all required fields', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showSignUpMessage('Please enter a valid email address', 'error');
    return;
  }
  
  if (!isValidPassword(password)) {
    showSignUpMessage('Password must be at least 8 characters with uppercase, lowercase, and numbers', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showSignUpMessage('Passwords do not match', 'error');
    return;
  }
  
  if (!terms) {
    showSignUpMessage('You must agree to the terms and conditions', 'error');
    return;
  }
  
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store user data in Firestore
    const userData = {
      uid: user.uid,
      fullName: fullName,
      email: email,
      company: company || '',
      createdAt: new Date().toISOString(),
      role: 'user',
      projectsCount: 0,
      totalSpent: 0
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    showSignUpMessage('Account created successfully! Redirecting to dashboard...', 'success');
    
    setTimeout(() => {
      window.location.href = '/pages/dashboard.html';
    }, 2000);
  } catch (error) {
    console.error('Sign up error:', error);
    let errorMessage = 'An error occurred. Please try again.';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please sign in instead.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use a stronger password.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Sign-up is currently disabled.';
    }
    
    showSignUpMessage(errorMessage, 'error');
  }
}

async function handleGoogleSignUp(e) {
  e.preventDefault();
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Store user data in Firestore
    const userData = {
      uid: user.uid,
      fullName: user.displayName || '',
      email: user.email,
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
      role: 'user',
      projectsCount: 0,
      totalSpent: 0
    };
    
    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
    
    showSignUpMessage('Account created successfully!', 'success');
    
    setTimeout(() => {
      window.location.href = '/pages/dashboard.html';
    }, 1500);
  } catch (error) {
    console.error('Google sign-up error:', error);
    showSignUpMessage('Google sign-up failed. Please try again.', 'error');
  }
}

function showSignUpMessage(message, type) {
  const messageDiv = document.getElementById('authMessage');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `auth-message ${type}`;
    messageDiv.style.display = 'block';
  }
}

console.log('Sign-up script loaded');
