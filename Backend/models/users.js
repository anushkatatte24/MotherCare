const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true // Ensures a user always has a name
    },
    email: {
        type: String,
        required: true, // Ensures a user always has an email
        unique: true
    },
    password: { 
        type: String, 
        required: true // Ensures a user always has a password
    },
    otp: { 
        type: String 
    },
    otpExpires: { 
        type: Date 
    },
});

// Use the standard singular name "User" for the model
const User = mongoose.model('User', userSchema);

module.exports = User;