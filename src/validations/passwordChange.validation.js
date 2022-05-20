const Joi = require('joi')

module.exports = {
  change: {
    body: Joi.object({
      email: Joi.string()
        .required()
        // .regex(
        //   /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
        // ),
        .email(),
    }),
  },
}
