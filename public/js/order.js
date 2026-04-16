// Order Form Handler
import { 
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getCurrentUser, db } from '/js/firebase-init.js';

document.addEventListener('DOMContentLoaded', () => {
  const orderForm = document.getElementById('orderForm');
  
  if (orderForm) {
    orderForm.addEventListener('submit', handleOrderSubmission);
  }
  
  // Update summary on package change
  const packageSelect = document.getElementById('package');
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  
  if (packageSelect) {
    packageSelect.addEventListener('change', updateOrderSummary);
  }
  
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', updateOrderSummary);
  });
});

async function handleOrderSubmission(e) {
  e.preventDefault();
  
  const user = getCurrentUser();
  if (!user) {
    showOrderMessage('You must be signed in to place an order', 'error');
    return;
  }
  
  // Collect form data
  const formData = {
    projectName: document.getElementById('projectName').value,
    businessName: document.getElementById('businessName').value,
    description: document.getElementById('description').value,
    budget: document.getElementById('budget').value,
    timeline: document.getElementById('timeline').value,
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    package: document.getElementById('package').value,
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value,
    additionalInfo: document.getElementById('additionalInfo').value,
    userId: user.uid,
    userEmail: user.email,
    createdAt: new Date().toISOString(),
    status: 'pending',
    projectStatus: 'planning'
  };
  
  // Validation
  if (!formData.projectName || !formData.businessName || !formData.fullName || !formData.email || !formData.package) {
    showOrderMessage('Please fill in all required fields', 'error');
    return;
  }
  
  if (!formData.paymentMethod) {
    showOrderMessage('Please select a payment method', 'error');
    return;
  }
  
  try {
    // Save order to Firestore
    const orderId = `order_${Date.now()}`;
    await setDoc(doc(db, 'orders', orderId), formData);
    
    // Also save to user's orders
    await setDoc(doc(db, `users/${user.uid}/orders`, orderId), formData);
    
    // Send order confirmation email
    await sendOrderConfirmationEmail(formData, orderId);
    
    showOrderMessage('Order submitted successfully! Check your email for confirmation.', 'success');
    
    setTimeout(() => {
      window.location.href = '/pages/dashboard.html';
    }, 2000);
    
  } catch (error) {
    console.error('Error submitting order:', error);
    showOrderMessage('Error submitting order. Please try again.', 'error');
  }
}

async function sendOrderConfirmationEmail(formData, orderId) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'order',
        to: 'jaidentinning1@outlook.com',
        from: formData.email,
        subject: `New Order: ${formData.projectName}`,
        orderData: formData,
        orderId: orderId
      })
    });
    
    if (!response.ok) {
      console.error('Email confirmation failed');
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

function updateOrderSummary() {
  const packageSelect = document.getElementById('package');
  const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
  
  if (packageSelect) {
    document.getElementById('summaryPackage').textContent = packageSelect.value || 'None';
  }
  
  if (paymentRadio) {
    document.getElementById('summaryPayment').textContent = paymentRadio.value || 'None';
  }
}

function showOrderMessage(message, type) {
  const messageDiv = document.getElementById('orderMessage');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `auth-message ${type}`;
    messageDiv.style.display = 'block';
  }
}

console.log('Order form handler loaded');
