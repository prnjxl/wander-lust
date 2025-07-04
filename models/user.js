const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
}); // user and password are automatically created by passport-local

userSchema.plugin(passportLocalMongoose); //^

const User = mongoose.model("User", userSchema);
module.exports = User;