const httpStatus = require('http-status')

const Staff = require('../models/staff.model')

async function permission(USER, res, ROLE) {
  // console.log(USER, ROLE, USER.isAdmin)
  if (ROLE === USER.isAdmin) {
    const user = await Staff.findById(USER.userID)
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized Access' })
    }
  } else if (ROLE === USER.isAdmin) {
    const user = await Staff.findById(USER.userId)
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized Access' })
    }
  } else {
    const user = await Staff.findById(USER.userId)
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized Access' })
    }
  }
}

module.exports = permission
