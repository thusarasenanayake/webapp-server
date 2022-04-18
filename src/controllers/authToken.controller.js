const httpStatus = require('http-status')
exports.confirm = async (req, res, next) => {
  try {
    return res.status(httpStatus.OK).json({ success: true })
  } catch (error) {
    next(error)
  }
}
