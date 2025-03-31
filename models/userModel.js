const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String},
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['reviewer', 'owner'], required: true },
    country: { type: String },
    gender: { type: String },
    photo: { type: String },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);