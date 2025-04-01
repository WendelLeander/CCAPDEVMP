const Restaurant = require('../models/restaurantModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Comment = require('../models/commentModel');



exports.viewRestaurant = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId }).lean();
    const restaurant = await Restaurant.findOne({ name: req.params.name }).lean();
    const restaurants = await Restaurant.find().lean();

    let sortRating = { rating: -1 };

    const reviews = await Review.find({ restaurant: req.params.name }).sort(sortRating).lean();
    const comments = await Comment.find({ reviewId: { $in: reviews.map(r => r._id) } }).lean();
    const reviewCount = reviews.length;
    const groupedComments = {};

    if (req.session.isLoggedIn){
        reviews.forEach(review => {
            review.isUser = review.user === user.username;
        });
    }


    comments.forEach(comment => {
        if (!groupedComments[comment.reviewId]) {
            groupedComments[comment.reviewId] = [];
        }
        groupedComments[comment.reviewId].push(comment);
    });

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
    if (req.session.isLoggedIn && restaurant) {
        if (user.username == restaurant.owner) {
            isOwner = true
        }
    }

    try {
        res.render('restaurant', {
            title: restaurant.name,
            layout: 'indexReviews',
            user: user,
            isLoggedIn: req.session.isLoggedIn,
            userId: req.session.userId,
            restaurants: restaurants,
            restaurant: restaurant,
            reviewCount: reviewCount,
            reviews: reviews,
            isOwner,
            comments: groupedComments
        });
    } catch (err) {
        res.status(500).send('Error retrieving restaurant');
    }
};


exports.editRestaurantPage = async (req, res) => {
    const name = req.params.name;
    const restaurant = await Restaurant.findOne({ name: name }).lean();
    const restaurants = await Restaurant.find().lean();
    try {
        res.render('editPage', {
            title: 'Edit Page - ' + name,
            layout: 'indexReviews',
            isLoggedIn: req.session.isLoggedIn,
            userId: req.session.userId,
            restaurants: restaurants,
            restaurant
        });
    } catch (err) {
        res.status(500).send('Error loading profile');
    }
};

exports.editRestaurant = async (req, res) => {
    const checker = await Restaurant.findOne({ name: req.params.name }).lean();

    let proceed = true;
    if (checker.name != req.body.restaurantName) {
        const existingRestaurant = await Restaurant.findOne({
            $or: [{ name: req.body.restaurantName }]
        });
        if (!existingRestaurant) {
            proceed = true;
        } else {
            proceed = false;
        }
    }

    if (proceed) {
        try {
            const updateQuery = { name: req.params.name };
            let restaurant = await Restaurant.findOne(updateQuery);
            const { restaurantName, restaurantLogo, restaurantLocation, restaurantHours, phone, photos, restaurantDescription } = req.body;
            restaurant.name = restaurantName;
            restaurant.location = restaurantLocation;
            restaurant.phone = phone;
            restaurant.logo = restaurantLogo;
            restaurant.photos = photos;
            restaurant.description = restaurantDescription;
            restaurant.hours = restaurantHours;
            await restaurant.save();

            let reviews = await Review.find({restaurant: req.params.name});
            for (let review of reviews) {
                review.restaurant = restaurantName;
                await review.save();  
            }

            res.redirect(`/restaurant/${restaurant.name}`);
        } catch (err) {
            res.status(500).send('Error');
        }
    }
    else {
        res.status(400).send(`<script>alert("Username or Email already exists!"); window.history.back();</script>`);
    }
};

exports.searchRestaurant = async (req, res) => {
    const searchTerm = req.query.query;
    const restaurants = await Restaurant.find().lean();
    const results = await Restaurant.find({ name: { $regex: searchTerm, $options: "i" } }).lean();
    try {
        res.render('searchRestaurant', {
            title: 'Search Results for ' + searchTerm,
            layout: 'indexReviews',
            isLoggedIn: req.session.isLoggedIn,
            userId: req.session.userId,
            restaurants: restaurants,
            results
        });
    } catch (err) {
        res.status(500).send('Error Searching');
        
    }
};

exports.searchRestaurant2 = async (req, res) => {
    const restaurants = await Restaurant.find().lean();
    const searchTerm = req.query.query;
    const sortOption = req.query.sort || "a-z";
    const minRating = req.query.rating || 0;

    let sortCriteria = {};
    if (sortOption === "a-z") {
        sortCriteria = { name: 1 }; 
    } else if (sortOption === "z-a") {
        sortCriteria = { name: -1 }; 
    } else if (sortOption === "rating-asc") {
        sortCriteria = { rating: 1 }; 
    } else if (sortOption === "rating-desc") {
        sortCriteria = { rating: -1 }; 
    }

    const results = await Restaurant.find({ 
        name: { $regex: searchTerm, $options: "i" }, 
        rating: { $gte: minRating } 
    })
    .sort(sortCriteria)
    .lean(); 
    try {
        res.render('searchRestaurant', {
            title: 'Search Results for ' + searchTerm,
            layout: 'indexReviews',
            isLoggedIn: req.session.isLoggedIn,
            userId: req.session.userId,
            restaurants: restaurants,
            results
        });
    } catch (err) {
        res.status(500).send('Error Searching');
        
    }
};

exports.findReviews = async (req, res) => {
    const searchTerm = req.query.reviewquery;
    const user = await User.findOne({ _id: req.session.userId }).lean();
    const restaurant = await Restaurant.findOne({ name: req.params.name }).lean();
    const restaurants = await Restaurant.find().lean();

    let sortRating = { rating: -1 };

    const reviews = await Review.find({ 
        restaurant: req.params.name,
        text: { $regex: searchTerm, $options: "i" }, 
    })
    .sort(sortRating)
    .lean();

    const comments = await Comment.find({ reviewId: { $in: reviews.map(r => r._id) } }).lean();
    const groupedComments = {};

    if (req.session.isLoggedIn){
        reviews.forEach(review => {
            review.isUser = review.user === user.username;
        });
    }


    comments.forEach(comment => {
        if (!groupedComments[comment.reviewId]) {
            groupedComments[comment.reviewId] = [];
        }
        groupedComments[comment.reviewId].push(comment);
    });

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
    if (req.session.isLoggedIn && restaurant) {
        if (user.username == restaurant.owner) {
            isOwner = true
        }
    }

    try {
        res.render('searchReview', {
            title: restaurant.name + ' - Find Review',
            layout: 'indexReviews',
            user: user,
            isLoggedIn: req.session.isLoggedIn,
            userId: req.session.userId,
            restaurants: restaurants,
            restaurant: restaurant,
            reviews: reviews,
            isOwner,
            comments: groupedComments
        });
    } catch (err) {
        res.status(500).send('Error searching review');
    }
};
