var mongoose = require('mongoose');
var passportLocaMongoose = require('passport-local-mongoose');

// User Schema
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocaMongoose); // take passport-local-mongoose package and add methods that come with it to UserSchema

module.exports = mongoose.model("User", UserSchema);
