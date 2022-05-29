const Staff = require('../models/staff.model')
const Customer = require('../models/customer.model')
const httpStatus = require('http-status')
const { mailService } = require('../services/mail')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var generator = require('generate-password')

//add emp
exports.create = async (req, res, next) => {
  try {
    const user = await Staff.findOne({
      userName: req.body.userName,
    })
    const userEmail = await Staff.findOne({
      email: req.body.email,
    })
    console.log(user, userEmail)
    if (userEmail) {
      return res.status(httpStatus.CONFLICT).send('userName  Already exists!!')
    }
    if (user) {
      return res.status(httpStatus.CONFLICT).send('userName  Already exists!!')
    } else {
      const prevUsr = await Staff.find({})
        .sort({ usrNumber: -1 })
        .limit(1)
        .select('usrNumber')
      if (prevUsr.length === 0) {
        console.log('hi')
        usrNumber = 0
      } else {
        console.log('bye')
        usrNumber = prevUsr[0].usrNumber
      }
      console.log(usrNumber)
      const user = new Staff({
        usrNumber: usrNumber + 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
      })
      await user.save()
      return res.status(httpStatus.CREATED).json({ user, success: true })
    }
  } catch (error) {
    next(error)
  }
}

//update acc
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

//change password
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

//delete emp
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
//view own acc details
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
//login
exports.login = async (req, res, next) => {
  console.log('ll')
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

//password reset
exports.resetPassword = async (req, res, next) => {
  try {
    const { userName, email } = req.body

    const user = await Staff.findOne({
      userName: userName,
      email: email,
      status: 'active',
    }).select('_id')
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send('A user is not available with given credentials')
    }

    var password = generator.generate({
      length: 6,
      numbers: true,
    })
    const newPassword = password
    const update = await bcrypt.hash(password, 10)

    await Staff.findByIdAndUpdate(user._id, {
      password: update,
    })

    mailService({
      type: 'password-reset',
      subject: 'Login Credential',
      email: req.body.email,
      password: newPassword,
    })

    return res.status(httpStatus.OK).json('OK')
  } catch (error) {
    next(error)
  }
}

exports.Promotion = async (req, res, next) => {
  try {
    const promotion = req.body

    const user = await Customer.find({
      status: 'active',
    }).select('email')
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send('A user is not available ')
    }
    console.log(user[0])
    for (let i = 0; i < user.length; i++) {
      mailService({
        type: 'promotion',
        subject: 'Promotions',
        email: user[i].email,
        promotion: promotion,
      })
    }

    return res.status(httpStatus.OK).json('OK')
  } catch (error) {
    next(error)
  }
}
//emp list
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
    if (users.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    }
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
