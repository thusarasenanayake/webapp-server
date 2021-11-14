const Joi = require('joi');
module.exports = {
    create: {
        body: Joi.object({
            _id: Joi.forbidden(),
            name: Joi.string().required(),
            description: Joi.string().required(),
            richDescription: Joi.string(),
            image: Joi.string().required(),
            images: Joi.string(),
            price: Joi.string().required(),
            category: Joi.string().required(),
            countInstock: Joi.string(),
            rating: Joi.string(),
            dateCreated: Joi.string()
        })
    }
}