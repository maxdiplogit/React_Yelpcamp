// Packages
const express = require('express');

// Router
const router = express.Router({ mergeParams: true });

// Models
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');

// Error Handler Helpers
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// Joi Schemas
const { reviewSchema } = require('../joiSchemas');

// Joi Validators
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// Middlewares
const { isLoggedIn } = require('../middleware');


// API Routes
router.get('/getReviewUser/:reviewUserId', catchAsync(async (req, res, next) => {
    const { id, reviewUserId } = req.params;
    const reviewUser = await User.findById(reviewUserId);
    res.json(reviewUser);
}));


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { rating, body } = req.body;
    const loggedInUserId = req.user._id;
    const review = new Review({ rating: rating, body: body, reviewUser: loggedInUserId });
    await review.save();
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    console.log(campground);
    campground.reviews.push(review);
    console.log(campground.reviews);
    await campground.save();
    // const finalObject = { camground: campground, author: campground.author };
    res.json(campground);
}));

router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${ id }`);
}));


module.exports = router;