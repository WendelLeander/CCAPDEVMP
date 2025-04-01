const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/:name', restaurantController.viewRestaurant);
router.get('/:name/edit-page', restaurantController.editRestaurantPage);
router.post('/:name/confirm-edit', restaurantController.editRestaurant);
router.get('/search/find-restaurant', restaurantController.searchRestaurant);
router.get('/search/find-restaurant2', restaurantController.searchRestaurant2);
router.get('/:name/search-reviews', restaurantController.findReviews);


module.exports = router;
