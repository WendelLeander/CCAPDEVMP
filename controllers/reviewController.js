const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');
const Comment = require('../models/commentModel');

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

exports.editReviewPage = async (req, res) => {
    const restaurants = await Restaurant.find().lean();
    const review = await Review.findOne({_id : req.params.reviewId}).lean();
    try {
        res.render('editReview', {
            layout: 'indexReviews',
            title: req.params.restaurantName+'- Edit Review',
            isLoggedIn: req.session.isLoggedIn,
            name: req.params.restaurantName,
            reviewId: req.params.reviewId,
            userId: req.session.userId,
            restaurants,
            review
        });
    } catch (err) {
        res.status(500).send('Error');
    }
};

exports.editReview = async (req, res) => {
    try {
        const updateQuery = { _id: req.params.reviewId };
        let review = await Review.findOne(updateQuery);
        const { text, rating, media } = req.body;
        const mediaUrl = media && media.trim() !== "" ? media : "";
        review.text = text;
        review.media = mediaUrl;
        review.rating = rating;
        review.status = "(edited)";
        await review.save();
        res.redirect(`/restaurant/${req.params.restaurantName}`);
    } catch (err) {
        res.status(500).send('Error editing review');
    }
};

exports.deleteReview = async (req, res) => {
    try {
        await Review.deleteOne({ _id: req.params.reviewId });
        await Comment.deleteMany({reviewId: req.params.reviewId})    
        res.redirect(`/restaurant/${req.params.restaurantName}`);
    } catch (err) {
        res.status(500).send('Error deleting review');
    }
};

exports.addCommentPage = async (req, res) => {
    const restaurants = await Restaurant.find().lean();
    const review = await Review.findOne({_id : req.params.reviewId}).lean();
    try {
        res.render('ownerComment', {
            layout: 'indexReviews',
            title: req.params.restaurantName+'- Review Response',
            isLoggedIn: req.session.isLoggedIn,
            name: req.params.restaurantName,
            reviewId: req.params.reviewId,
            userId: req.session.userId,
            restaurants,
            review
        });
    } catch (err) {
        res.status(500).send('Error');
    }
};

exports.addComment = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId }).lean();
    try {
        const comment = new Comment({
            username: user.username,
            text: req.body.text,
            reviewId: req.params.reviewId
        });
        await comment.save();
        res.redirect(`/restaurant/${req.params.restaurantName}`);
    } catch (err) {
        res.status(500).send('Error creating review');
    }
};

exports.verifyReview = async (req, res) => {
    try {
        const updateQuery = { _id: req.params.reviewId };
        let review = await Review.findOne(updateQuery);
        review.verified = true;
        await review.save();
        res.redirect(`/restaurant/${req.params.restaurantName}`);
    } catch (err) {
        res.status(500).send('Error verifying review');
    }
};
