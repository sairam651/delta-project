const Joi = require('joi');

module.exports.listingSchema=Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image: Joi.object({
        url: Joi.string().allow("", null),
        })//here image is not cumpulsory that its required but we are allowing for empty string and null values of image
    })
})

//validation for review schema
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

//to require reviewSchema in app.js write
//const {reviewSchema}=require("./schema.js") 