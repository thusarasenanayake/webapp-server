const Joi = require('joi')
module.exports = {
  search: {
    body: Joi.object({
      searchData: Joi.string().required(),
    }),
  },
}
