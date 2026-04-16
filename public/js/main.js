// Main JavaScript - General functionality for all pages

document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeScrollAnimations();
  handleMobileMenu();
  initializeOrderModal();
});

// Navigation functionality
function initializeNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
      hamburger.classList.toggle('active');
    });
    
    // Close menu when clicking on link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.style.display = 'none';
        hamburger.classList.remove('active');
      });
    });
  }
}

// Order Modal Functions
function initializeOrderModal() {
  const modal = document.getElementById('orderModal');
  window.onclick = (event) => {
    if (event.target === modal) {
      closeOrderModal();
    }
  };
}

function showOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    // Clear form
    const form = document.getElementById('orderForm');
    if (form) form.reset();
  }
}

async function handleOrderSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = {
    name: document.getElementById('orderName')?.value || '',
    email: document.getElementById('orderEmail')?.value || '',
    phone: document.getElementById('orderPhone')?.value || '',
    description: document.getElementById('orderDescription')?.value || '',
    paymentMethod: document.getElementById('paymentMethod')?.value || ''
  };

  try {
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Send to backend
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Order submitted successfully! We will contact you shortly.', 'success');
      closeOrderModal();
      // Wait a moment then redirect to dashboard if user is logged in
      setTimeout(() => {
        if (window.isAuthenticated && window.isAuthenticated()) {
          window.location.href = '/pages/dashboard.html';
        }
      }, 2000);
    } else {
      showMessage(result.error || 'Failed to submit order. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Order submission error:', error);
    showMessage('An error occurred. Please try again.', 'error');
  } finally {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Message display function
function showMessage(message, type = 'info') {
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `message-notification ${type}`;
  messageEl.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    ${message}
  `;
  
  // Style the message
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    display: flex;
    align-items: center;
    gap: 10px;
    ${type === 'success' ? 'background: #10b981; color: white;' : ''}
    ${type === 'error' ? 'background: #ef4444; color: white;' : ''}
    ${type === 'info' ? 'background: #3b82f6; color: white;' : ''}
  `;
  
  document.body.appendChild(messageEl);
  
  // Remove after 4 seconds
  setTimeout(() => {
    messageEl.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => messageEl.remove(), 300);
  }, 4000);
}

// Smooth scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll(
    '.feature-card, .service-card-large, .value-card, .payment-card, .team-member, ' +
    '.package-card, .faq-item, .stat-card, .glass'
  );
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

// Mobile menu handling
function handleMobileMenu() {
  window.addEventListener('resize', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (window.innerWidth > 768) {
      if (navMenu) navMenu.style.display = 'flex';
      if (hamburger) hamburger.classList.remove('active');
    }
  });
}

// Scroll to top button
window.addEventListener('scroll', () => {
  const scrollButton = document.getElementById('scrollTop');
  if (scrollButton) {
    scrollButton.style.display = window.scrollY > 300 ? 'block' : 'none';
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Format date
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

// Get URL parameters
function getUrlParameter(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Local storage utilities
const Storage = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  }
};

// Navigation utility
function navigateTo(url) {
  window.location.href = url;
}

console.log('Main utilities loaded');
