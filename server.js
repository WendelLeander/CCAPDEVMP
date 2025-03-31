const express = require('express');
const session = require("express-session");
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const helpers = require('handlebars-helpers')();
const MongoStore = require("connect-mongo");

const app = express();

const mongoURI = process.env.MONGODB_URI || "mongodb+srv://wendelwalterleander:2aacXeDQSEvmqfG6@cluster0.ywgslxz.mongodb.net/reviewdb";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));



app.use(session({
  secret: "Shabuhay_55",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: mongoURI,
      collectionName: "sessions"
  }),
  cookie: {
      maxAge: 3 * 7 * 24 * 60 * 60 * 1000, // 3 weeks
      secure: false // Set to true if using HTTPS
  }
}));

app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
  extname: 'hbs',
  helpers: {
    times: function (n, block) {
      let result = '';
      for (let i = 0; i < n; i++) {
        result += block.fn(i);
      }
      return result;
    },
      formatDate: function (date) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      return new Date(date).toLocaleString('en-US', options);
    }
  }
}));

const Restaurant = require('./models/restaurantModel');

app.get('/', async function (req, resp) {
  const restaurants = await Restaurant.find().lean();
  const firstRestaurant = restaurants.length > 0 ? restaurants[0] : null;
  resp.render('homepage', {
    layout: 'index1',
    title: 'BiteBuzz',
    restaurants: restaurants,
    isLoggedIn: req.session.isLoggedIn,
    userId: req.session.userId,
    firstRestaurant: firstRestaurant
  });
});

app.get('/Log-in', async function (req, resp) {
  resp.render('Log_in', {
    layout: 'indexLogin',
    title: 'Log In',
  });
});

app.get('/register', async function (req, resp) {
  resp.render('register', {
    layout: 'indexRegister',
    title: 'Register',
  });
});

app.get('/Log-out', function (req, resp) {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    resp.redirect('/');
  });
});

app.use('/restaurant', require('./routes/restaurantRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/reviews', require('./routes/reviewRoutes'));
/*
app.use('/comments', require('./routes/commentRoutes'));
*/



function finalClose() {
  console.log('Close connection at the end!');
  mongoose.connection.close();
  process.exit();
}


process.on('SIGTERM', finalClose);  //general termination signal
process.on('SIGINT', finalClose);   //catches when ctrl + c is used
process.on('SIGQUIT', finalClose); //catches other termination commands

const port = process.env.PORT | 9090;
app.listen(port, function () {
  console.log('Listening at port ' + port);
});
