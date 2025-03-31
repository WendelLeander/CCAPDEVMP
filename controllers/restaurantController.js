const Restaurant = require('../models/restaurantModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');



exports.viewRestaurant = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId }).lean();
    const restaurant = await Restaurant.findOne({name: req.params.name}).lean();
    const restaurants = await Restaurant.find().lean();
    const reviews = await Review.find({restaurant: req.params.name}).lean();
    const name = restaurant.name;
    const reviewCount = reviews.length;

    let averageRating = 0;
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = totalRating / reviews.length;
    }

    await Restaurant.findOneAndUpdate(
        { name: req.params.name },
        { $set: { rating: averageRating.toFixed(1) } },
        { new: true } 
    );

    let isOwner = false;
    if (req.session.isLoggedIn){
        if (user.username == restaurant.owner){
            isOwner = true
        }
    }

        
    try {
        res.render('restaurant', { 
            title: name,
            layout: 'indexReviews',
            user: user,
            isLoggedIn: req.session.isLoggedIn,
            userId: req.session.userId,
            restaurants: restaurants,
            restaurant: restaurant,
            reviewCount: reviewCount,
            reviews: reviews,
            isOwner
         });
    } catch (err) {
        res.status(500).send('Error retrieving restaurant');
    }
};

// Edit restaurant details
exports.editRestaurant = async (req, res) => {
    try {
        await Restaurant.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/restaurants/${req.params.id}`);
    } catch (err) {
        res.status(500).send('Error updating restaurant');
    }
};
