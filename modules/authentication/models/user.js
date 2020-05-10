const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    role: String,
    active: Boolean,
    lastLogin: Date
});

module.exports = mongoose.model('User', UserSchema);