const { promisify } = require('util');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const appError = require('../utils/appError');
const jwt = require('jsonwebtoken');


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
}

exports.signup = asyncHandler(async (req, res, next) => {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm

    });
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    // 1) Check if email and password exist
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError('Please provide email and password', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    // console.log(user.name);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError('Incorrect email or password', 401));
    }
    // 3) If everything is ok, send token to client

    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});


exports.protect = asyncHandler(async (req, res, next) => {

    // 1) Check if token exist and if it's valid
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new appError('You are not logged in! Please log in to get access.', 401));
    }
    // 2) validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new appError('The user belonging to this token no longer exists.', 401));
    }
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError('User recently changed password! Please log in again.', 401))
    };
    // 5) If everything is ok, grant access to protected route
    req.user = currentUser;
    next();
})
