const express = require('express');
const session = require("express-session");
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const helpers = require('handlebars-helpers')();

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/reviewdb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

const THREE_WEEKS = 1000 * 60 * 60 * 24 * 21;

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: false, 
      maxAge: THREE_WEEKS 
    }
  })
);

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
