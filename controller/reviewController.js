const Review = require('./../models/reviewModel');
const asyncHandler = require('./../utils/asyncHandler');
const appError = require('./../utils/appError');


// GET ALL REVIEWS
exports.getAllReviews = asyncHandler(async (req, res, next) => { 
    const review = await Review.find();
    res.status(200).json({
        status: 'success',
        results: review.length,
        data: {
            review
        }
    });
});

//create a review
exports.createReview = asyncHandler(async (req, res, next) => { 
    // const newReview = await new Review({
    //     review: req.body.review,
    //     ratting: req.body.ratting,
    //     user: req.user.id,
    //     tour: req.body.tour
    // }).save();
    // check if the user has already reviewed the tour
    if (!req.bady.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            newReview
        }
    });
});
