// Reviews Routes
import express from 'express';
import { Review } from '../models/Review.js';

const router = express.Router();

// GET /api/reviews - Get all reviews
router.get('/', async (req, res) => {
  try {
    // TODO: Fetch from Firestore
    
    res.json({
      success: true,
      reviews: [
        {
          id: '1',
          author: 'John Doe',
          rating: 5,
          title: 'Amazing Service!',
          content: 'Jaiden delivered exactly what we needed. Professional and fast!',
          createdAt: new Date(),
          helpful: 12
        },
        {
          id: '2',
          author: 'Jane Smith',
          rating: 5,
          title: 'Best Web Designer',
          content: 'Highly recommend. Quality work at reasonable prices.',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          helpful: 8
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews - Create a new review
router.post('/', async (req, res) => {
  try {
    const { author, rating, title, content, userId } = req.body;

    if (!author || !rating || !title || !content) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5'
      });
    }

    // TODO: Save to Firestore

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review: {
        author,
        rating,
        title,
        content,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// PUT /api/reviews/:id/helpful - Mark review as helpful
router.put('/:id/helpful', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Update in Firestore
    
    res.json({
      success: true,
      message: 'Review marked as helpful'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

export default router;
