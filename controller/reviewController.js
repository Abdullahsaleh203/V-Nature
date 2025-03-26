const Review = require('./../models/reviewModel');
const asyncHandler = require('./../utils/asyncHandler');
// const appError = require('./../utils/appError');
const factory = require('./handlerFactory');

// GET ALL REVIEWS
exports.getAllReviews = asyncHandler(async (req, res, next) => { 
    let filter = {};
    // allow nested routes
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const review = await Review.find(filter);
    res.status(200).json({
        status: 'success',
        results: review.length,
        data: {
            review
        }
    });
});
exports.setTourUserIds = (req, res, next) => {
    // check if the user has already reviewed the tour
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
}
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
