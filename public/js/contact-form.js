// Contact Form Handler
import { 
  doc, 
  setDoc, 
  collection 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { db } from '/js/firebase-init.js';

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
});

async function handleContactForm(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  
  if (!name || !email || !subject || !message) {
    showFormMessage('Please fill in all fields', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showFormMessage('Please enter a valid email address', 'error');
    return;
  }
  
  try {
    // Save to Firestore
    const contactData = {
      name: name,
      email: email,
      subject: subject,
      message: message,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    
    const docId = `contact_${Date.now()}`;
    await setDoc(doc(db, 'contacts', docId), contactData);
    
    // Send email notification (via backend)
    await sendContactNotificationEmail(contactData);
    
    showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
    
    // Reset form
    document.getElementById('contactForm').reset();
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    showFormMessage('Error sending message. Please try again.', 'error');
  }
}

async function sendContactNotificationEmail(contactData) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'contact',
        to: 'jaidentinning1@outlook.com',
        from: contactData.email,
        subject: `New Contact: ${contactData.subject}`,
        message: contactData.message,
        name: contactData.name
      })
    });
    
    if (!response.ok) {
      console.error('Email notification failed');
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

function showFormMessage(message, type) {
  const messageDiv = document.getElementById('formMessage');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `auth-message ${type}`;
    messageDiv.style.display = 'block';
  }
}

console.log('Contact form handler loaded');
