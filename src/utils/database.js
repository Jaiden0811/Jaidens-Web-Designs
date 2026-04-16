// Database utilities
export const initializeFirestore = (admin) => {
  return admin.firestore();
};

export const initializeRealtimeDatabase = (admin) => {
  return admin.database();
};

// Collections initialization
export const ensureCollectionsExist = async (db) => {
  try {
    // Initialize collections if they don't exist
    const collections = ['users', 'orders', 'reviews', 'chats'];
    
    for (const collection of collections) {
      const snapshot = await db.collection(collection).limit(1).get();
      if (snapshot.empty) {
        // Create a placeholder document to initialize the collection
        if (collection === 'chats') {
          await db.collection(collection).doc('general').set({
            name: 'General Chat',
            createdAt: new Date(),
            messageCount: 0
          });
        } else if (collection === 'reviews') {
          // Sample reviews
          await db.collection(collection).add({
            author: 'Sample User',
            rating: 5,
            title: 'Great Service!',
            content: 'Highly recommended!',
            createdAt: new Date(),
            helpful: 0,
            verified: true
          });
        }
      }
    }
    
    console.log('Collections initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing collections:', error);
    throw error;
  }
};

// Batch operations
export const batchUpdateOrders = async (db, updates) => {
  try {
    const batch = db.batch();
    
    for (const update of updates) {
      const ref = db.collection('orders').doc(update.id);
      batch.update(ref, update.data);
    }
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error in batch update:', error);
    throw error;
  }
};
