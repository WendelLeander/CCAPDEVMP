const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    owner: { type: String },
    logo: { type: String },
    photos: [{ type: String }],
    description: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    hours: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);