const Joi = require('joi');

const campgroundSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().min(0),
    deleteImages: Joi.array()
});

const reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5),
    body: Joi.string().required()
});


module.exports = { campgroundSchema, reviewSchema };