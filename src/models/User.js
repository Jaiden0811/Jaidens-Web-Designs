// User Model for Firestore
export const User = {
  // Create user profile
  async createProfile(db, userId, userData) {
    try {
      await db.collection('users').doc(userId).set({
        email: userData.email,
        displayName: userData.displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          bio: '',
          avatar: null,
          phone: ''
        },
        orders: [],
        preferences: {
          emailNotifications: true,
          chatNotifications: true
        }
      });
      return true;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Get user profile
  async getProfile(db, userId) {
    try {
      const userRef = await db.collection('users').doc(userId).get();
      if (userRef.exists) {
        return { id: userRef.id, ...userRef.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(db, userId, profileData) {
    try {
      await db.collection('users').doc(userId).update({
        ...profileData,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Add order to user's order list
  async addOrder(db, userId, orderId) {
    try {
      await db.collection('users').doc(userId).update({
        orders: db.FieldValue.arrayUnion(orderId)
      });
      return true;
    } catch (error) {
      console.error('Error adding order to user:', error);
      throw error;
    }
  }
};
