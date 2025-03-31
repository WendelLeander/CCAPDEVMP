const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/:restaurantName/create-review', reviewController.createReviewPage);
router.post('/:restaurantName/submit-review', reviewController.createReview);
router.post('/:restaurantId/reviews/:reviewId/edit', reviewController.editReview);
router.post('/:id/vote', reviewController.markReview);
module.exports = router;
