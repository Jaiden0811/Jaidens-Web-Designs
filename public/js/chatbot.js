// AI Chatbot Functionality

let chatbotOpen = false;
const chatbotResponses = {
  'pricing': [
    "We offer flexible pricing with customizable packages. Use our Pricing Calculator to see costs for your specific features!",
    "Our pricing depends on your needs. Check the Pricing page to calculate your project cost."
  ],
  'order': [
    "Click the 'Place Order' button anywhere on the site to start. Fill in your project details and choose your payment method.",
    "Ready to order? Click the button and tell us about your project. We'll take it from there!",
    "Visit any page and click 'Place Order' to get started with your web design project."
  ],
  'services': [
    "We offer: Custom Web Design, Full-Stack Development, Mobile Optimization, SEO, Security, and 24/7 Support.",
    "Our main services include professional web design, development, and ongoing support."
  ],
  'payment': [
    "We accept: Cash, Cash App, Venmo, Credit Cards, and Gift Cards (Amazon, Apple, Visa, etc.).",
    "Multiple payment methods: Cash, Cash App, Venmo, Gift Cards, and traditional credit card payments.",
    "Choose from Cash, Cash App, Venmo, or Gift Cards - whatever works best for you!"
  ],
  'contact': [
    "Email: jaidentinning1@outlook.com - We respond within 24 hours!",
    "Reach us at jaidentinning1@outlook.com or use the Contact form on our website."
  ],
  'dashboard': [
    "Sign up for free to access your personal dashboard! You can track project progress, view your timeline, and more.",
    "Members get: Project tracking, real-time status updates, community chat access, and review posting."
  ],
  'account': [
    "Create a free account by clicking 'Sign Up'. It's quick and gives you access to your project dashboard!",
    "Sign in/up to track your projects and access member-only features."
  ],
  'support': [
    "We're here 24/7! Chat here, email jaidentinning1@outlook.com, or use the Contact form.",
    "Need help? I'm available 24/7, or reach us at jaidentinning1@outlook.com"
  ],
  'timeline': [
    "Typical timeline: Planning (2 days) → Designing (3 days) → Coding (5 days) → Testing (2 days) → Launch. Total: ~2 weeks.",
    "Most projects complete in 2 weeks, depending on complexity. We'll give you a specific timeline when you order."
  ],
  'chat': [
    "Members can join our Community Chat to connect with other clients, share ideas, and get tips!",
    "Sign up and access our Community Chat room to connect with other clients and our team."
  ],
  'reviews': [
    "Check out our Reviews page to see what our clients say about us. We love feedback!",
    "Read real reviews from happy clients on our Reviews page."
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const chatbotToggle = document.getElementById('chatbotToggle') || document.getElementById('chatbot-widget');
  
  if (chatbotToggle) {
    chatbotToggle.addEventListener('click', toggleChatbot);
  }
  
  const chatbotInput = document.getElementById('chatbotInput');
  if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }
});

function toggleChatbot() {
  const chatbot Widget = document.getElementById('chatbotWindow') || document.getElementById('chatbot-messages');
  if (chatbotWidget) {
    chatbotOpen = !chatbotOpen;
    chatbotWidget.style.display = chatbotOpen ? 'block' : 'none';
    
    if (chatbotOpen) {
      const input = document.getElementById('chatbotInput');
      if (input) setTimeout(() => input.focus(), 100);
    }
  }
}

function handleChatMessage(message) {
  const input = document.getElementById('chatbotInput');
  if (input) {
    input.value = message;
    sendChatMessage();
  }
}

function sendChatMessage() {
  const input = document.getElementById('chatbotInput');
  if (!input || !input.value.trim()) return;
  
  const userMessage = input.value.trim();
  const messagesContainer = document.getElementById('chatbotMessages') || document.getElementById('chatbot-messages');
  
  if (messagesContainer) {
    // Add user message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chatbot-message user-message message user-message';
    userMsgDiv.innerHTML = `<p>${escapeHtml(userMessage)}</p>`;
    messagesContainer.appendChild(userMsgDiv);
    
    // Clear input
    input.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Get bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage);
      const botMsgDiv = document.createElement('div');
      botMsgDiv.className = 'chatbot-message bot-message message bot-message';
      botMsgDiv.innerHTML = `<p>${escapeHtml(botResponse)}</p>`;
      messagesContainer.appendChild(botMsgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 300);
  }
}

function generateBotResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for keywords in message
  for (const [keyword, responses] of Object.entries(chatbotResponses)) {
    if (lowerMessage.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Default responses for common questions
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "👋 Hello! Welcome to Jaiden Web Designs. How can I help you today? Ask about pricing, services, orders, or anything else!";
  }
  
  if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('?')) {
    return "Great question! I can help you with: Pricing, Services, Payment Options, How to Order, Timeline, Account/Dashboard, Support, or anything else about Jaiden Web Designs!";
  }
  
  if (lowerMessage.includes('who') || lowerMessage.includes('about us') || lowerMessage.includes('about')) {
    return "We're Jaiden Web Designs - a professional web design agency building high-end, custom websites. We're Fast, Professional, and Accessible. Check our About page for more!";
  }
  
  if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
    return "You're welcome! Anything else I can help with?";
  }
  
  return "That's a great question! I'm here to help. Ask me about pricing, services, ordering, timelines, or reach us anytime at jaidentinning1@outlook.com!";
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

console.log('Chatbot functionality loaded');
