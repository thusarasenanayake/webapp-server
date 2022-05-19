const httpStatus = require('http-status')
const Customer = require('../models/customer.model')
const bcrypt = require('bcryptjs')
const { mailService } = require('../services/mail')
var generator = require('generate-password')

exports.reset = async (req, res, next) => {
  console.log(req.body.email)

  var password = generator.generate({
    length: 6,
    numbers: true,
  })

  try {
    const filter = { email: req.body.email }
    const newPassword = password
    const update = { password: bcrypt.hashSync(newPassword, 10) }
    const user = await Customer.findOne({ email: req.body.email })
    if (user) {
      let customer = await Customer.findOneAndUpdate(filter, update, {
        returnOriginal: false,
      })
      if (customer) {
        mailService({
          type: 'password-reset',
          subject: 'Login Credential',
          email: req.body.email,
          password: newPassword,
        })
        return res.status(httpStatus.OK).send('OK!!')
      }
    } else {
      return res.status(httpStatus.NOT_FOUND).send('Not found!!')
    }
  } catch (error) {
    next(error)
  }
}
