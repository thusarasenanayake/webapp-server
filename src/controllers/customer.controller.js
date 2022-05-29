const Customer = require('../models/customer.model')
const Order = require('../models/order.model')
const Cart = require('../models/cart.model')
const { mailService } = require('../services/mail')
const httpStatus = require('http-status')
const { query } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
exports.create = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email })
    if (customer) {
      return res.status(httpStatus.CONFLICT).send('Email  Already exists!!')
    } else {
      const prevCus = await Customer.find({})
        .sort({ cusNumber: -1 })
        .limit(1)
        .select('cusNumber')
      console.log(prevCus)
      if (prevCus.length === 0) {
        console.log('hi')
        cusNumber = 0
      } else {
        console.log('bye')
        cusNumber = prevCus[0].cusNumber
      }
      console.log(cusNumber)
      const customer = new Customer({
        cusNumber: cusNumber + 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
      })

      await customer.save()
      const newCustomer = await Customer.findOne({ email: req.body.email })
      const cart = new Cart({
        customerID: newCustomer.id,
        customerEmail: newCustomer.email,
      })
      await cart.save()

      return res.status(httpStatus.CREATED).json({ customer, cart })
    }
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  console.log(req.user, req.body)
  try {
    const user = await Customer.findById(req.user.customerID)
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send('User not found!!')
    }
    if (user) {
      console.log('user')

      if (req.body.email === user.email) {
        const customer = await Customer.findByIdAndUpdate(
          req.user.customerID,
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
          },
          { new: true },
        )
        if (customer) {
          return res.status(httpStatus.OK).json({ customer, success: true })
        }
      } else {
        const user = await Customer.findOne({
          email: req.body.email,
        })
        if (!user) {
          const customer = await Customer.findByIdAndUpdate(
            req.user.customerID,
            {
              userName: req.body.userName,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              phoneNumber: req.body.phoneNumber,
              address: req.body.address,
            },
            { new: true },
          )
          return res.status(httpStatus.OK).json({ customer, success: true })
        } else {
          return res.status(httpStatus.CONFLICT).send('User name already exist')
        }
      }
    }
  } catch (error) {
    next(error)
  }
}
//customers data view him self
exports.self = async (req, res, next) => {
  // console.log('ll');
  try {
    const id = req.user.customerID
    const customer = await Customer.findById(id)
      .where('status')
      .equals('active')
      .select('firstName lastName email address phoneNumber')
    // console.log('pp',customer);
    if (!customer) {
      throw Error('User not found!!')
    }
    return res.status(httpStatus.OK).json({ customer })
  } catch (error) {
    next(error)
  }
}

exports.reset = async (req, res, next) => {
  console.log(req.user.customerID)
  try {
    const user = await Customer.findById(req.user.customerID)
      .where('status')
      .equals('active')
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send('User not found!!')
    }
    if (user && bcrypt.compareSync(req.body.current_password, user.password)) {
      const customer = await Customer.findByIdAndUpdate(
        req.user.customerID,
        {
          password: bcrypt.hashSync(req.body.password, 10),
        },
        { new: true },
      )
    } else {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .json('Password Not matched')
    }
    return res.status(httpStatus.OK).send('Password changed')
  } catch (error) {
    next(error)
  }
}
// customer data view from staff end
exports.view = async (req, res, next) => {
  try {
    const id = req.params.id
    const customer = await Customer.findById(id)
      .where('status')
      .equals('active')
      .select('firstName lastName email address phoneNumber')
    if (!customer) {
      throw Error('User not found!!')
    }
    return res.status(httpStatus.OK).json({ customer })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  console.log(req.body)
  try {
    const customer = await Customer.findOne({ email: req.body.email })
      .where('status')
      .equals('active')
    const secret = process.env.secret
    if (!customer) {
      return res.status(httpStatus.NOT_FOUND).send('customer not found!!')
    }
    if (customer && bcrypt.compareSync(req.body.password, customer.password)) {
      const token = jwt.sign(
        {
          customerID: customer._id,
        },
        secret,
        { expiresIn: '1d' },
      )

      return res
        .status(httpStatus.OK)
        .send({ customer: customer, token: token })
    } else {
      return res.status(httpStatus.NOT_FOUND).send('Password is wrong!')
    }
  } catch (error) {
    next(error)
  }
}

exports.list = async (req, res, next) => {
  const filter = {}
  try {
    const query = Customer.find(filter)
      .where('status')
      .equals('active')
      .select('-passwordHash -__v -createdAt -updatedAt')
    const customers = await query.exec()
    if (customers.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send('no data found')
    }
    return res.status(httpStatus.OK).json({ customers })
  } catch (error) {
    next(error)
  }
}
exports.promotion = async (req, res, next) => {
  try {
    const promotion = req.body.promotion
    const id = req.params.id
    console.log(req.params)
    console.log(promotion)
    const user = await Customer.findById(id).select('email')
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send('A user is not available ')
    }
    console.log(user.email)
    mailService({
      type: 'single-promotion',
      subject: 'Promotions',
      email: user.email,
      promotion: promotion,
    })

    return res.status(httpStatus.OK).json('OK')
  } catch (error) {
    next(error)
  }
}
exports.delete = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        status: 'deleted',
      },
      { new: true },
    )
    if (!customer) {
      return res.status(httpStatus.NOT_FOUND).send('User not found!!')
    }
    return res.status(httpStatus.OK).json({ customer })
  } catch (error) {
    next(error)
  }
}
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params
    const query = await Customer.findByIdAndRemove(id)
    return res.status(httpStatus.OK).json({ query })
  } catch (error) {
    next(error)
  }
}
