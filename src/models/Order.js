// Order Model for Firestore
export const Order = {
  // Create a new order
  async create(db, orderData) {
    try {
      const ordersRef = await db.collection('orders').add({
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        description: orderData.description,
        paymentMethod: orderData.paymentMethod,
        status: 'pending',
        createdAt: new Date(),
        estimatedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        timeline: {
          planning: { status: 'pending', date: null },
          designing: { status: 'pending', date: null },
          coding: { status: 'pending', date: null },
          testing: { status: 'pending', date: null },
          launch: { status: 'pending', date: null }
        }
      });
      return { id: ordersRef.id, ...orderData };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get order by ID
  async getById(db, orderId) {
    try {
      const orderRef = await db.collection('orders').doc(orderId).get();
      if (orderRef.exists) {
        return { id: orderRef.id, ...orderRef.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Get all orders for a user
  async getByUserId(db, userId) {
    try {
      const snapshot = await db.collection('orders').where('userId', '==', userId).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Update order status
  async updateStatus(db, orderId, status, timeline) {
    try {
      await db.collection('orders').doc(orderId).update({
        status,
        timeline,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }
};
