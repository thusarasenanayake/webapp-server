const httpStatus = require('http-status')
const Cart = require('../models/cart.model')
const Product = require('../models/product.model')

exports.update = async (req, res, next) => {
  console.log(req.body.authEmail)
  console.log(req.body.newProduct)
  let reqData = req.body.newProduct
  try {
    const cartDetails = await Cart.findOne({ email: req.body.authEmail })
      .where('status')
      .equals('active')
    let prevCartItem = cartDetails.cartItem

    const id = cartDetails._id
    var cartItem = []
    cartItem.push({ item: reqData.productID, quantity: reqData.quantity })
    prevCartItem.map((item, index) =>
      cartItem.push({ item: item.item._id, quantity: item.quantity }),
    )

    console.log(cartItem, 'hii')
    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      {
        cartItem: cartItem,
      },
      { new: true },
    )
    if (!updatedCart) {
      return res.status(httpStatus.NOT_FOUND).send('updatedCart not found!!')
    }
    return res.status(httpStatus.OK).json({ updatedCart })
  } catch (error) {
    next(error)
  }
}
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.body
    const query = await Cart.findByIdAndRemove(id)
    return res.status(httpStatus.OK).json({ query })
  } catch (error) {
    next(error)
  }
}
exports.list = async (req, res, next) => {
  try {
    const email = req.body.authEmail
    const cartList = await Cart.findOne({ email: email })
      .select('-__v')
      .populate({ path: 'cartItem.item', model: Product })
    if (!cartList) {
      throw Error('cartList not found!!')
    }
    const cartItem = cartList.cartItem
    return res.status(httpStatus.OK).json({ cartItem })
  } catch (error) {
    next(error)
  }
}
// exports.count = async (req, res, next) => {
//   const filter = {}
//   try {
//     Order.count(filter, function (err, count) {
//       if (!count) return res.status(httpStatus.NOT_FOUND).send('No data found')
//       return res.status(httpStatus.OK).json({ count })
//     })
//   } catch (error) {
//     next(error)
//   }
// }
