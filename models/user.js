const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username: String 
});

userSchema.plugin(passportLocalMongoose); // This adds username and password fields

module.exports = mongoose.model('User', userSchema);