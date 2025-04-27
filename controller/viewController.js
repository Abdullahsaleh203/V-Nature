const asyncHandler = require('../utils/asyncHandler');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getOverview = asyncHandler(async (req, res, next) => {
// 1) Get tour data from collection
    const tours = await Tour.find();
    // 2) Build template
    // 3) Render that template using tour data from 1)

    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

exports.getTour = asyncHandler(async (req, res, next) => {
    // 1)Get the data , from requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews', fields: 'review rating user'
    });
    // 2) building the template

    // 3) Render the template using tour data
    if (!tour) {
        return next(new AppError('No tour found with that name', 404));
    }
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });

    // 4) Send the response
    // const tour = await Tour.findById(req.params.id).populate('reviews');
})

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
}

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Create your account'
    });
}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
  });
}
exports.updateUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    });

    res.status(200).render('account', {
        title: 'Your account',
    user: updatedUser
  });
});
// exports.getSingUpForm = (req, res) => {
//     res.status(200).render('signup', {
//         title: 'signup'
//     });
// }

// log out
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).redirect('/');
};
