const Joi = require('joi');





// LISTINGS SCHEMA SERVER SIDE VALIDATION

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description: Joi.string().required(),
        location : Joi.string().required(),
        country: Joi.string().required(),
        price : Joi.number().required(),
        image: Joi.string().allow("", null).required(),
     }).required(),
});

module.exports = listingSchema;


// REVIEW SCHEMA SERVER SIDE VALIDATION 

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

module.exports = reviewSchema;


