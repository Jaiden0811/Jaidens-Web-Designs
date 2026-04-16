// General Authentication Functions

function logout() {
  if (confirm('Are you sure you want to sign out?')) {
    auth.signOut().then(() => {
      console.log('User logged out successfully');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }).catch((error) => {
      console.error('Error signing out:', error);
      showMessage('Error signing out. Please try again.', 'error');
    });
  }
}

function goToDashboard() {
  window.location.href = '/pages/dashboard.html';
}

function navigateTo(url) {
  window.location.href = url;
}

function placeOrder() {
  if (getCurrentUser()) {
    // If user is logged in, go to order form
    window.location.href = '/pages/order.html';
  } else {
    // If not logged in
    if (confirm('You need to sign in to place an order. Would you like to sign in now?')) {
      window.location.href = '/pages/signin.html?redirect=/pages/order.html';
    }
  }
}

function showMessage(message, type = 'info') {
  const messageDiv = document.getElementById('authMessage') || document.getElementById('orderMessage');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `auth-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }
}

function switchTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));
  
  // Remove active class from menu items
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  
  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Set active class on menu item
  const activeItem = document.querySelector(`[onclick*="switchTab('${tabName}')"]`);
  if (activeItem) {
    activeItem.classList.add('active');
  }
}

// Utility function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function to validate password strength
function isValidPassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password);
}

// Utility function to show toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Delete account
function deleteAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    if (confirm('This will permanently delete your account and all associated data. Continue?')) {
      const user = getCurrentUser();
      if (user) {
        user.delete().then(() => {
          showMessage('Account deleted successfully', 'success');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }).catch((error) => {
          console.error('Error deleting account:', error);
          showMessage('Error deleting account: ' + error.message, 'error');
        });
      }
    }
  }
}

console.log('Authentication utilities loaded');
