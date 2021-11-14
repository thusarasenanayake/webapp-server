const Joi = require('joi');

module.exports = {
    create: {
        body: Joi.object({
            _id: Joi.forbidden(),
            name: Joi.string().required(),
            icon: Joi.string(),
            image: Joi.string()
        })
    }
}