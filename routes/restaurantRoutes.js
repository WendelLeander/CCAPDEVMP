const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/:name', restaurantController.viewRestaurant);
router.post('/:id/edit', restaurantController.editRestaurant);

module.exports = router;
