const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

// List reviews with optional filters: from_role, from_id, to_role, to_id, tutor_id, student_id
router.get('/', reviewsController.listReviews);

// Create a review: { from_role: 'student'|'tutor', from_id, to_role, to_id, rating (1-5), comment }
router.post('/', reviewsController.createReview);

// Update a review (rating/comment)
router.put('/:id', reviewsController.updateReview);

// Delete a review
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;
