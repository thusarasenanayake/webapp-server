const Customer = require('../models/customer.model')
const Cart = require('../models/cart.model')
const httpStatus = require('http-status')
const { query } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
exports.create = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email })
    if (customer) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send('Email  Already exists!!')
    } else {
      const customer = new Customer({
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
  try {
    const cusEmailID = await Customer.findOne({ email: req.body.email })
    console.log(cusEmailID)
    if (cusEmailID) {
      const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
        },
        { new: true },
      )
      if (!customer) {
        return res.status(httpStatus.NOT_FOUND).send('User not found!!')
      }
      return res.status(httpStatus.OK).json({ customer, success: true })
    } else {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send('Can not Process')
    }
  } catch (error) {
    next(error)
  }
}
//customers data view him self
exports.self = async (req, res, next) => {
  // console.log('ll');
  try {
    const  id  = req.user.customerID
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
// customer data view from staff end
exports.view = async (req, res, next) => {
  console.log('ll');
  try {
    const id = req.params.id
    console.log(id);
    const customer = await Customer.findById(id)
      .where('status')
      .equals('active')
      .select('firstName lastName email address phoneNumber')
    console.log(customer);
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
    return res.status(httpStatus.OK).json({ customers })
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
