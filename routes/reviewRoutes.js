const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/:restaurantName/create-review', reviewController.createReviewPage);
router.post('/:restaurantName/submit-review', reviewController.createReview);
router.get('/:restaurantName/:reviewId/edit-review', reviewController.editReviewPage);
router.post('/:restaurantName/:reviewId/resubmit-review', reviewController.editReview);
router.get('/:restaurantName/:reviewId/delete-review', reviewController.deleteReview);
router.get('/:restaurantName/:reviewId/owner-comment', reviewController.addCommentPage);
router.post('/:restaurantName/:reviewId/owner-respond', reviewController.addComment);
router.get('/:restaurantName/:reviewId/owner-verify', reviewController.verifyReview);
router.post('/:id/vote', reviewController.markReview);
module.exports = router;
