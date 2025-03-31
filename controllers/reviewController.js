const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');

exports.createReviewPage = async (req, res) => {
    const restaurants = await Restaurant.find().lean();
    try {
        res.render('createReview', {
            layout: 'indexReviews',
            title: req.params.restaurantName+'- Create Review',
            isLoggedIn: req.session.isLoggedIn,
            name: req.params.restaurantName,
            userId: req.session.userId,
            restaurants
        });
    } catch (err) {
        res.status(500).send('Error');
    }
};

exports.createReview = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId }).lean();
    try {
        const { text, rating, media } = req.body;
        const mediaUrl = media && media.trim() !== "" ? media : "";
        const review = new Review({
            user: user.username,
            restaurant: req.params.restaurantName,
            userPhoto: user.photo,
            text,
            rating,
            media: mediaUrl
        });
        await review.save();
        res.redirect(`/restaurant/${req.params.restaurantName}`);
    } catch (err) {
        res.status(500).send('Error creating review');
    }
};

exports.markReview = async (req, res) => {
    try {
        const { type } = req.body; // "helpful" or "unhelpful"
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (type === "helpful") {
            review.helpful += 1;
        } else if (type === "unhelpful") {
            review.unhelpful += 1;
        } else {
            return res.status(400).json({ error: "Invalid vote type" });
        }

        await review.save();

        res.json({ helpful: review.helpful, unhelpful: review.unhelpful });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update review" });
    }
};





// Edit a review
exports.editReview = async (req, res) => {
    try {
        await Review.findByIdAndUpdate(req.params.reviewId, req.body);
        res.redirect(`/restaurants/${req.params.restaurantId}`);
    } catch (err) {
        res.status(500).send('Error editing review');
    }
};

// View a restaurant with reviews
exports.viewRestaurantWithReviews = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('reviews');
        res.render('restaurant', { title: restaurant.name, ...restaurant.toObject() });
    } catch (err) {
        res.status(500).send('Error loading restaurant');
    }
};
