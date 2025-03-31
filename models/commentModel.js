const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    reviewId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);