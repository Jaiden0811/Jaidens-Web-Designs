// Chat Functionality
import { 
  ref,
  push,
  onChildAdded,
  query,
  orderByChild,
  limitToLast
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getCurrentUser, rtdb } from '/js/firebase-init.js';

let currentChannel = 'general';
let messagesRef = null;

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = '/pages/signin.html';
    return;
  }
  
  // Load channel buttons
  const channelItems = document.querySelectorAll('.channel-item');
  channelItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const channel = item.getAttribute('data-channel');
      switchChannel(channel);
    });
  });
  
  // Setup message form
  const messageForm = document.getElementById('messageForm');
  if (messageForm) {
    messageForm.addEventListener('submit', handleSendMessage);
  }
  
  // Load initial channel
  switchChannel('general');
});

function switchChannel(channel) {
  currentChannel = channel;
  
  // Update active channel
  const channelItems = document.querySelectorAll('.channel-item');
  channelItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-channel') === channel) {
      item.classList.add('active');
    }
  });
  
  // Update channel title
  const titles = {
    'general': 'General Chat',
    'support': 'Support',
    'announcements': 'Announcements',
    'showcase': 'Showcase'
  };
  
  const descriptions = {
    'general': 'Chat with other members of the Jaiden Web Designs community',
    'support': 'Get help from our support team and community members',
    'announcements': 'Latest news and updates from Jaiden Web Designs',
    'showcase': 'Share and see amazing projects built with us'
  };
  
  document.getElementById('channelTitle').textContent = titles[channel] || 'Chat';
  document.getElementById('channelDescription').textContent = descriptions[channel] || '';
  
  // Clear messages
  const messagesContainer = document.getElementById('chatMessages');
  if (messagesContainer) {
    messagesContainer.innerHTML = '<div class="message system-message"><p>Loading messages...</p></div>';
  }
  
  // Load messages for channel
  loadChannelMessages(channel);
  
  // Load online users for channel
  loadOnlineUsers(channel);
}

function loadChannelMessages(channel) {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return;
  
  // Clear previous listeners
  if (messagesRef) {
    messagesRef.off('child_added');
  }
  
  messagesRef = ref(rtdb, `channels/${channel}/messages`);
  
  const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(50));
  
  let firstLoad = true;
  
  onChildAdded(messagesQuery, (snapshot) => {
    const message = snapshot.val();
    const messageElement = createMessageElement(message);
    
    if (firstLoad) {
      messagesContainer.innerHTML = '';
      firstLoad = false;
    }
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
}

function createMessageElement(message) {
  const div = document.createElement('div');
  const isCurrentUser = getCurrentUser().uid === message.userId;
  
  div.className = `message ${isCurrentUser ? 'user-message' : 'bot-message'}`;
  
  const time = new Date(message.timestamp).toLocaleTimeString();
  
  div.innerHTML = `
    <p>${escapeHtml(message.text)}</p>
    <div class="message-time">${time}</div>
  `;
  
  return div;
}

async function handleSendMessage(e) {
  e.preventDefault();
  
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  const user = getCurrentUser();
  if (!user) return;
  
  try {
    const messageRef = ref(rtdb, `channels/${currentChannel}/messages`);
    await push(messageRef, {
      text: message,
      userId: user.uid,
      userName: user.displayName || user.email.split('@')[0],
      timestamp: new Date().getTime(),
      userEmail: user.email
    });
    
    input.value = '';
    input.focus();
  } catch (error) {
    console.error('Error sending message:', error);
    showToast('Error sending message', 'error');
  }
}

function loadOnlineUsers(channel) {
  // For demo purposes, show a few sample users
  const onlineUsersList = document.getElementById('onlineUsers');
  if (!onlineUsersList) return;
  
  const sampleUsers = [
    getCurrentUser().displayName || getCurrentUser().email.split('@')[0],
    'John Designer',
    'Sarah Developer',
    'Mike Support'
  ];
  
  onlineUsersList.innerHTML = sampleUsers.map(user => 
    `<li><span class="online-indicator"></span> ${escapeHtml(user)}</li>`
  ).join('');
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

console.log('Chat functionality loaded');
