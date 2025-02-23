const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    // role: {
    //     type: String,
    //     enum: ['user', 'guide', 'lead-guide', 'admin'],
    //     default: 'user'
    // },
    password: {
        type: String,
        required: true,
        minlength: 8, 
        select: false,
        maxlength: 100,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (val) {
                return val === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;
