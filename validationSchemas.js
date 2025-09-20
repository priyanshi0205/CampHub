const Joi=require('joi');

//Because we may have many schemas that we need to validate


module.exports.campgroundSchema=Joi.object({      //For validating Campground before insertion
    campground:Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        body:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5)
    }).required()
})