const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: String,
    facebookID: String,
    accessToken: String,
}, { collection: 'users' });

const model = mongoose.model('users', schema);

module.exports = model;