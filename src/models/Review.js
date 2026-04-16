// Review Model for Firestore
export const Review = {
  // Create a new review
  async create(db, reviewData) {
    try {
      const reviewRef = await db.collection('reviews').add({
        author: reviewData.author,
        authorId: reviewData.authorId,
        rating: reviewData.rating, // 1-5
        title: reviewData.title,
        content: reviewData.content,
        createdAt: new Date(),
        helpful: 0,
        verified: false
      });
      return { id: reviewRef.id, ...reviewData };
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Get all reviews
  async getAll(db) {
    try {
      const snapshot = await db.collection('reviews').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Get reviews by rating
  async getByRating(db, minRating = 4) {
    try {
      const snapshot = await db.collection('reviews')
        .where('rating', '>=', minRating)
        .orderBy('rating', 'desc')
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching reviews by rating:', error);
      throw error;
    }
  },

  // Mark review as helpful
  async markHelpful(db, reviewId) {
    try {
      await db.collection('reviews').doc(reviewId).update({
        helpful: db.FieldValue.increment(1)
      });
      return true;
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  }
};
