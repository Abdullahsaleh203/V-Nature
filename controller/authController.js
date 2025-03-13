const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const appError = require('../utils/appError');
const sendEmail = require('../utils/email');

// Create a JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
}

// Sign up a new user
// This function will create a new user in the database and send a JWT token to the client.
exports.signup = asyncHandler(async (req, res, next) => {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role

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

// Log in a user and send a JWT token
// This function will log in a user and send a JWT token to the client.
// The client can then use this token to access protected routes.
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


/* protect middleware
    This middleware will check if the user is logged in or not. 

    If the user is logged in, 
    it will grant access to the protected route. Otherwise, it will return an error message.
*/
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
    // console.log(decoded);

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
// restrictTo middleware
// This middleware will restrict access to certain routes based on the user's role.
// For example, if a user is not an admin, they will not be able to access the admin route.
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError('You do not have permission to perform this action', 403));
        }
        next();
    }
};


// forgotPassword middleware
// This middleware will generate a password reset token and send it to the user's email.
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError('There is no user with email address.', 404));
    }
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and 
    passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError('There was an error sending the email. Try again later!', 500));
    }
});

// resetPassword middleware
// This middleware will reset the user's password and send a new JWT token to the client.
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new appError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});


// updatePassword middleware
// This middleware will update the user's password and send a new JWT token to the client.
exports.updatePassword = asyncHandler(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');
    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new appError('Your current password is wrong.',401));
    }
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
   // User.findByIdAndUpdate will NOT work as intended!
   
    // 4) Log user in, send JWT
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });


});

