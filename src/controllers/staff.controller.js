const Staff = require('../models/staff.model')
const httpStatus = require('http-status')
// const { query } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.create = async (req, res, next) => {
  try {
    const user = await Staff.findOne({ userName: req.body.userName })
    if (user) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send('userName  Already exists!!')
    } else {
      const user = new Staff({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 10),
      })
      await user.save()
      return res.status(httpStatus.CREATED).json({ user, success: true })
    }
  } catch (error) {
    next(error)
  }
}
exports.update = async (req, res, next) => {
  try {
    const user = await Staff.findById(req.user.userID)
      .where('status')
      .equals('active')
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send('User not found!!')
    }
    if (user) {
      if (user.userName === req.body.userName) {
        const staff = await Staff.findByIdAndUpdate(
          req.user.userID,
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
          },
          { new: true },
        )
        return res.status(httpStatus.OK).json({ staff, success: true })
      } else {
        const user = await Staff.findOne({ userName: req.body.userName })
        if (!user) {
          const staff = await Staff.findByIdAndUpdate(
            req.user.userID,
            {
              userName: req.body.userName,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
            },
            { new: true },
          )
          return res.status(httpStatus.OK).json({ staff, success: true })
        } else {
          return res.status(httpStatus.CONFLICT).send('User name already exist')
        }
      }
    }
  } catch (error) {
    next(error)
  }
}

exports.reset = async (req, res, next) => {
  try {
    const user = await Staff.findById(req.user.userID)
      .where('status')
      .equals('active')
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send('User not found!!')
    }
    if (user && bcrypt.compareSync(req.body.current_password, user.password)) {
      const staff = await Staff.findByIdAndUpdate(
        req.user.userID,
        {
          password: bcrypt.hashSync(req.body.password, 10),
        },
        { new: true },
      )
    } else {
      return res.status(httpStatus.BAD_REQUEST).json('Password Not matched')
    }
    return res.status(httpStatus.OK).send('Password changed')
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
//view emp details
exports.view = async (req, res, next) => {
  try {
    const user = await Staff.findById(req.params.id)
      .where('status')
      .equals('active')
      .select('userName firstName lastName')
    if (!user) {
      throw Error('User not found!!')
    }
    return res.status(httpStatus.OK).json({ user })
  } catch (error) {
    next(error)
  }
}
exports.profile = async (req, res, next) => {
  try {
    const user = await Staff.findById(req.user.userID)
      .where('status')
      .equals('active')
      .select('userName firstName lastName')
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
    const user = await Staff.findOne({ userName: req.body.userName })
      .where('status')
      .equals('active')
    const secret = process.env.secret

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send('User not found!!')
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        {
          userID: user._id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: '1d' },
      )
      return res.status(httpStatus.OK).send({ user: user, token: token })
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
    console.log(query)
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
