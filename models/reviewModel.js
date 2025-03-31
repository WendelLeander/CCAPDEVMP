const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: String, required: true},
    userPhoto: { type: String, required: true},
    restaurant: { type: String, required: true},
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    media: { type: String },
    helpful: { type: Number, default: 0 },
    unhelpful: { type: Number, default: 0 },
    status: { type: String, default: ""},
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
