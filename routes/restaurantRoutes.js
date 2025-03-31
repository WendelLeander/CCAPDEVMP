const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/:name', restaurantController.viewRestaurant);
router.get('/:name/edit-page', restaurantController.editRestaurantPage);
router.post('/:name/confirm-edit', restaurantController.editRestaurant);


module.exports = router;
