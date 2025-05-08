const asyncHandler = require('../utils/asyncHandler');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');

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

exports.getForgotPasswordForm = (req, res) => {
    res.status(200).render('forgot-password', {
        title: 'Forgot Password'
    });
};

exports.getResetPasswordForm = (req, res) => {
    res.status(200).render('resetPassword', {
        title: 'Reset Your Password',
        token: req.params.token
    });
};

exports.getMyTours = asyncHandler(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
    });
});

// exports.updateUserData = catchAsync(async (req, res, next) => {
//     const updatedUser = await User.findByIdAndUpdate(
//         req.user.id,
//         {
//             name: req.body.name,
//             email: req.body.email
//         },
//         {
//             new: true,
//             runValidators: true
//         }
//     );

//     res.status(200).render('account', {
//         title: 'Your account',
//         user: updatedUser
//     });
// });
exports.getCreateTourForm = asyncHandler(async (req, res, next) => {
    // Get all guides for the tour
    const guides = await User.find({ role: { $in: ['guide', 'lead-guide'] } });

    res.status(200).render('createTour', {
        title: 'Create New Tour',
        guides
    });
});

exports.getManageTours = asyncHandler(async (req, res, next) => {
    // Get all tours
    const tours = await Tour.find().sort('-createdAt');

    res.status(200).render('manageTours', {
        title: 'Manage Tours',
        tours
    });
});

exports.getManageUsers = asyncHandler(async (req, res, next) => {
    // Get all users
    const users = await User.find().sort('-createdAt');

    res.status(200).render('manageUsers', {
        title: 'Manage Users',
        users
    });
});

exports.getManageReviews = asyncHandler(async (req, res, next) => {
    // Get all reviews with populated tour and user data
    const reviews = await Review.find()
        .populate({
            path: 'tour',
            select: 'name'
        })
        .populate({
            path: 'user',
            select: 'name photo'
        })
        .sort('-createdAt');

    res.status(200).render('manageReviews', {
        title: 'Manage Reviews',
        reviews
    });
});

exports.getManageBookings = asyncHandler(async (req, res, next) => {
    // Get all bookings with populated tour and user data
    const bookings = await Booking.find()
        .populate({
            path: 'tour',
            select: 'name price'
        })
        .populate({
            path: 'user',
            select: 'name email'
        })
        .sort('-createdAt');

    res.status(200).render('manageBookings', {
        title: 'Manage Bookings',
        bookings
    });
});

exports.getMyBookings = asyncHandler(async (req, res, next) => {
    // Get all bookings for the logged-in user
    const bookings = await Booking.find({ user: req.user.id })
        .populate({
            path: 'tour',
            select: 'name price imageCover'
        })
        .sort('-createdAt');

    res.status(200).render('myBookings', {
        title: 'My Bookings',
        bookings
    });
});

exports.getEditTourForm = asyncHandler(async (req, res, next) => {
    // Get the tour and guides
    const tour = await Tour.findById(req.params.id);
    const guides = await User.find({ role: { $in: ['guide', 'lead-guide'] } });

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).render('editTour', {
        title: 'Edit Tour',
        tour,
        guides
    });
});

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
