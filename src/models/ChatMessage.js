// Chat Message Model for Realtime Database
export const ChatMessage = {
  // Send message to chat room
  async send(rtdb, userId, userName, message, room = 'general') {
    try {
      const messagesRef = rtdb.ref(`chat/${room}`);
      await messagesRef.push({
        userId,
        userName,
        message,
        timestamp: Date.now(),
        avatar: null
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get chat history
  async getHistory(rtdb, room = 'general', limit = 50) {
    try {
      const messagesRef = rtdb.ref(`chat/${room}`);
      const snapshot = await messagesRef.limitToLast(limit).get();
      
      const messages = [];
      snapshot.forEach(childSnapshot => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      return messages;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  // Listen for new messages in real-time
  onNewMessage(rtdb, room = 'general', callback) {
    const messagesRef = rtdb.ref(`chat/${room}`);
    messagesRef.on('child_added', (snapshot) => {
      callback({
        id: snapshot.key,
        ...snapshot.val()
      });
    });
  },

  // Stop listening to messages
  offNewMessage(rtdb, room = 'general') {
    const messagesRef = rtdb.ref(`chat/${room}`);
    messagesRef.off();
  }
};
