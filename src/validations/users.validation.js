const Joi = require('joi');
const role = ["admin","customer","employee"];
module.exports = {
    create: {
        body: Joi.object({
            _id: Joi.forbidden(),
            name: Joi.string().required(),
            email: Joi.string().required(),
            passwordHash: Joi.string().required(),
            street: Joi.string().required(),
            apartment:Joi.string().required(),
            city: Joi.string().required(),
            zip: Joi.string(),
            phoneNo: Joi.number().required(),
            isAdmin: Joi.string().required(),
            role: Joi.string().valid(...role).required(),
        })
    }
}