const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');
const Review = require('../models/reviewModel');


exports.login = async (req, res) => {

    const searchQuery = { username: req.body.username, password: req.body.password };
    let login = await User.findOne(searchQuery);

    if (login != undefined && login._id != null) {
        req.session.userId = login._id;
        req.session.isLoggedIn = true;
        res.redirect('/');
    } else {
        res.status(400).send(`<script>alert("Invalid Credentials!"); window.history.back();</script>`);
    }

};

exports.register1 = (req, res) => {
    try {
        res.render('registerReviewer', {
            layout: 'indexRegister2',
            title: 'Register - Reviewer',
        });
    } catch (err) {
        res.status(500).send('Error');
    }
};

exports.register2 = (req, res) => {
    try {
        res.render('registerOwner', {
            layout: 'indexRegister2',
            title: 'Register - Owner',
        });
    } catch (err) {
        res.status(500).send('Error');
    }
};

exports.register3 = async (req, res) => {
    const existingUser = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }]
    });

    if (!existingUser) {
        req.session.login = req.body;
        try {
            res.render('registerOwner2', {
                layout: 'indexRegister3',
                title: 'Register - Owner',
            });
        } catch (err) {
            res.status(500).send('Error');
        }
    }
    else {
        res.status(400).send(`<script>alert("Username or Email already exists!"); window.history.back();</script>`);
    }
};

exports.registerAddInfo1 = async (req, res) => {
    const existingUser = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }]
    });

    if (!existingUser) {
        req.session.login = req.body;
        try {
            res.render('registerAddInfo', {
                layout: 'indexRegister4',
                title: 'Register - More Info',
                username: req.body.username
            });
        } catch (err) {
            res.status(500).send('Error');
        }
    }
    else {
        res.status(400).send(`<script>alert("Username or Email already exists!"); window.history.back();</script>`);
    }

};

exports.registerEstablishment = async (req, res) => {

    req.session.establishment = req.body;

    try {
        res.render('registerAddInfo2', {
            layout: 'indexRegister4',
            title: 'Register - More Info',
            username:req.session.login.username
        });
    } catch (err) {
        res.status(500).send('Error');
    }

};

exports.saveUser = async (req, res) => {
    if (!req.session.login) {
        return res.status(400).send("Session expired. Please register again.");
    }

    const login = req.session.login;
    let photo = req.body.photo || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png";
    let country = req.body.country || "N/A";


    try {
        const loginInstance = new User({
            firstname: login.firstname,
            lastname: login.lastname,
            password: login.password,
            username: login.username,
            role: "reviewer",
            country: country,
            email: login.email,
            description: login.shortDescription,
            gender: req.body.gender,
            photo: photo
        });

        const savedUser = await loginInstance.save();


        req.session.userId = savedUser._id;
        req.session.isLoggedIn = true;

        res.redirect('/');
    } catch (err) {
        res.status(500).send("Error saving user.");
    }
};

exports.saveUser2 = async (req, res) => {
    if (!req.session.login) {
        return res.status(400).send("Session expired. Please register again.");
    }
    const login = req.session.login;
    const establishment = req.session.establishment;
    let photo = req.body.photo || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png";
    let country = req.body.country || "N/A";


    try {
        const loginInstance = new User({
            firstname: login.firstname,
            lastname: login.lastname,
            password: login.password,
            username: login.username,
            role: "owner",
            country: country,
            email: login.email,
            description: login.shortDescription,
            gender: req.body.gender,
            photo: photo
        });

        const savedUser = await loginInstance.save();

        const restaurantInstance = Restaurant({
            name: establishment.restaurantName,
            location: establishment.restaurantLocation,
            phone: establishment.phone,
            email: establishment.email,
            owner: login.username,
            logo: establishment.restaurantLogo,
            photos: establishment.photos,
            description: establishment.restaurantDescription,
            rating: 0,
            hours: establishment.restaurantHours
        });

        let result = await restaurantInstance.save();

        req.session.userId = savedUser._id;
        req.session.isLoggedIn = true;

        res.redirect('/');
    } catch (err) {
        res.status(500).send("Error saving user.");
    }
};


exports.viewProfile = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId }).lean();
    const restaurants = await Restaurant.find().lean();
    const reviews = await Review.find({ user: user.username }).lean();
    let isUser = false;
    if (req.session.userId == userId) {
        isUser = true;
    }
    try {
        res.render('profile', {
            title: 'User Profile - ' + user.username,
            layout: 'indexReviews',
            user: user,
            isLoggedIn: req.session.isLoggedIn,
            userId: req.session.userId,
            restaurants: restaurants,
            reviews: reviews,
            isUser
        });
    } catch (err) {
        res.status(500).send('Error loading profile');
    }
};

exports.viewOtherProfile = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username: username }).lean();
    try {
        res.redirect(`/user/profile/${user._id}`);
    } catch (err) {
        res.status(500).send('Error loading profile');
    }
};

exports.editProfilePage = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId }).lean();
    const restaurants = await Restaurant.find().lean();
    try {
        res.render('editProfile', {
            title: 'Edit Profile - ' + user.username,
            layout: 'indexReviews',
            user: user,
            isLoggedIn: req.session.isLoggedIn,
            userId: req.session.userId,
            restaurants: restaurants,
        });
    } catch (err) {
        res.status(500).send('Error loading profile');
    }
};

exports.editProfile = async (req, res) => {
    try {
        const updateQuery = { _id: req.params.userId };
        let user = await User.findOne(updateQuery);
        const { firstname, lastname, photo, gender, country, shortDescription } = req.body;
        user.firstname = firstname;
        user.lastname = lastname;
        user.gender = gender;
        user.country = country || "N/A";
        user.description = shortDescription;
        user.photo = photo || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png";
        await user.save();
        res.redirect(`/user/profile/${user._id}`);
    } catch (err) {
        res.status(500).send('Error');
    }
    
};




