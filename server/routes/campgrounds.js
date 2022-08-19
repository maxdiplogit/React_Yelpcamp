// Packages
const express = require('express');
const multer = require('multer');
const path = require('path');

// Storage destination for the files recieved using multer for newCampground Images (stored in 'cloudinary')
const { storage, cloudinary } = require('../cloudinary/index');

const upload = multer({ storage });

// Router
const router = express.Router();

// Models
const Campground = require('../models/campground');

// Error Handler Helpers
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// Middlewares
const { isLoggedIn } = require('../middleware');

// Joi Schemas
const { campgroundSchema } = require('../joiSchemas');

// Joi Validators
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


// API Routes
router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({}).populate('author');
    // console.log(req.session);
    res.json(campgrounds);
}));

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    res.json(campground);
}));

router.post('/', isLoggedIn, upload.array('images'), validateCampground, catchAsync(async (req, res, next) => {
    // if (title === "") {
    //     throw new ExpressError('Title is empty!', 200);
    // }
    // if (location === "") {
    //     throw new ExpressError('Location is empty!', 200)
    // }
    const { title, location } = req.body;
    // console.log('req.files: ', req.files);
    const loggedInUserId = req.user._id;
    const newCampground = new Campground({ title: title, location: location, author: loggedInUserId });
    newCampground.images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
    await newCampground.save();
    console.log(newCampground);
    // console.log(req.body);
    res.json(newCampground);
}));

router.put('/:id', isLoggedIn, upload.array('images'), validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    console.log("REQ.BODY: ", req.body);
    const { title, location } = req.body;
    const campground = await Campground.findByIdAndUpdate(id, {
        title,
        location
    });
    const images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
    campground.images.push(...images);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(campground);
    }
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));


module.exports = router;