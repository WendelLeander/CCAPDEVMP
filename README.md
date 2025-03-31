# BiteBuzz - Restaurant Review App

BiteBuzz is a restaurant review platform built with Node.js, Express, and MongoDB.

# Project Repository

 - https://github.com/WendelLeander/CCAPDEVMP

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- [MongoDB](https://www.mongodb.com/) (Ensure a MongoDB instance is running)


## Instructions

2. **Install dependencies:**

   npm install


3. **Run the application:**

    node server.js

5. **Access the application:**  
   Open your browser and go to:  

   http://localhost:9090 or go to https://ccapdevmp-0wl8.onrender.com (Deployed Version)


## Project Structure

```
.
├── models/                 # Mongoose models
│   ├── restaurantModel.js
├── routes/                 # Express routes
│   ├── restaurantRoutes.js
│   ├── userRoutes.js
│   ├── reviewRoutes.js
├── views/                  # Handlebars templates
│   ├── homepage.hbs
│   ├── Log_in.hbs
│   ├── register.hbs
│   ├── layouts/
├── public/                 # Static assets (CSS, images, etc.)
├── app.js                  # Main Express app
├── package.json
└── README.md
```

## API Endpoints

### **Public Routes**
- `GET /` - Home Page
- `GET /Log-in` - Login Page
- `GET /register` - Register Page
- `GET /Log-out` - Logout

### **Restaurant Routes**
- `GET /restaurant` - Fetch all restaurants
- `POST /restaurant` - Add a new restaurant

### **User Routes**
- `POST /user/register` - Register a new user
- `POST /user/login` - Authenticate user

### **Review Routes**
- `POST /reviews` - Add a new review for a restaurant

## Closing the Server

The application gracefully closes the MongoDB connection when terminated:

Ctrl + C



