const Staff = require('../models/staff.model')
const httpStatus = require('http-status')
const { query } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.create = async (req, res, next) => {
  console.log(req.body)
  try {
    const user = await Staff.findOne({ email: req.body.email })
    if (user) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send('Email  Already exists!!')
    } else {
      const user = new Staff({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        isAdmin: req.body.isAdmin,
        role: req.body.role,
      })
      console.log(user, 'user')
      await user.save()
      return res.status(httpStatus.CREATED).json({ user })
    }
  } catch (error) {
    next(error)
  }
}
exports.update = async (req, res, next) => {
  try {
    const userEmailID = await Staff.findOne({ email: req.body.email })
    //can update data with new email
    if (userEmailID === null) {
      const user = await Staff.findByIdAndUpdate(
        req.params.id,
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          houseNumber: req.body.houseNumber,
          streetName: req.body.streetName,
          city: req.body.city,
        },
        { new: true },
      )
      if (!user) {
        return res.status(httpStatus.NOT_FOUND).send('User not found!!')
      }
      return res.status(httpStatus.OK).json({ user })
      //checking new email is already exist or not
    } else if (userEmailID.id != req.params.id) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send('Email is already exits')
    } else {
      //update data with same email
      const user = await Staff.findByIdAndUpdate(
        req.params.id,
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
        },
        { new: true },
      )
      if (!user) {
        return res.status(httpStatus.NOT_FOUND).send('User not found!!')
      }
      return res.status(httpStatus.OK).json({ user })
    }
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const user = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        status: 'deleted',
      },
      { new: true },
    )
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send('User not found!!')
    }
    return res.status(httpStatus.OK).json({ user })
  } catch (error) {
    next(error)
  }
}

exports.view = async (req, res, next) => {
  try {
    const { id } = req.params
    console.log('Requested user id', id)
    const user = await Staff.findById(id).select('-__v')
    if (!user) {
      throw Error('User not found!!')
    }
    return res.status(httpStatus.OK).json({ user })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const user = await Staff.findOne({ email: req.body.email })
    const secret = process.env.secret
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send('User not found!!')
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        {
          userID: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: '1d' },
      )
      return res
        .status(httpStatus.OK)
        .send({ user: user.firstName, token: token })
    } else {
      return res.status(httpStatus.NOT_FOUND).send('Password is wrong!')
    }
  } catch (error) {
    next(error)
  }
}

exports.listEmployee = async (req, res, next) => {
  const filter = {}
  try {
    const query = Staff.find(filter)
      .where('status')
      .equals('active')
      .where('isAdmin')
      .equals(false)
      .select('-passwordHash -__v -createdAt -updatedAt')
    const users = await query.exec()
    return res.status(httpStatus.OK).json({ users })
  } catch (error) {
    next(error)
  }
}
//view list of admins
exports.listAdmin = async (req, res, next) => {
  const filter = {}
  try {
    const query = Staff.find(filter)
      .where('status')
      .equals('active')
      .where('isAdmin')
      .equals(true)
      .select('-passwordHash -__v -createdAt -updatedAt')
    const users = await query.exec()
    return res.status(httpStatus.OK).json({ users })
  } catch (error) {
    next(error)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params
    const query = await Staff.findByIdAndRemove(id)
    return res.status(httpStatus.OK).json({ query })
  } catch (error) {
    next(error)
  }
}