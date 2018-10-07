var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    _ = require('lodash');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
        },
    password:  {
        type: String,
        unique: false
        }
});

userSchema.plugin(passportLocalMongoose);

userSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'username']);
};

var User = mongoose.model("User",userSchema);

module.exports = User;