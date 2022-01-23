const httpStatus = require('http-status')
const Cart = require('../models/cart.model')
const Product = require('../models/product.model')

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params
    let isMatched = false
    if (id !== 'null') {
      const cartDetails = await Cart.findOne({ customerID: id })
        .where('status')
        .equals('active')
      let prevCartItem = cartDetails.cartItem

      const cartID = cartDetails._id
      var cartItem = []
      async function checkCart() {
        await prevCartItem.map((item, index) => {
          if (item.item.toString() === req.body.productID) {
            isMatched = true
          }
        })
      }
      checkCart()
      if (prevCartItem.length === 0) {
        cartItem.push({ item: req.body.productID, quantity: req.body.quantity })
      } else {
        if (isMatched === false) {
          cartItem.push({
            item: req.body.productID,
            quantity: req.body.quantity,
          })
        } else {
          return res.status(httpStatus.UNPROCESSABLE_ENTITY).send('Item Exist!')
        }
      }
      prevCartItem.map((item, index) =>
        cartItem.push({ item: item.item._id, quantity: item.quantity }),
      )
      const updatedCart = await Cart.findByIdAndUpdate(
        cartID,
        {
          cartItem: cartItem,
        },
        { new: true },
      )
      if (!updatedCart) {
        return res.status(httpStatus.NOT_FOUND).send('updatedCart not found!!')
      }
      return res.status(httpStatus.OK).json({ updatedCart })
    } else {
      return res.status(httpStatus.UNAUTHORIZED).send('User not found!!')
    }
  } catch (error) {
    next(error)
  }
}
exports.clear = async (req, res, next) => {
  try {
    const { id } = req.params
    let reqData = req.body.newProduct
    const cartDetails = await Cart.findOne({ customerID: id })
      .where('status')
      .equals('active')

    const cartID = cartDetails._id
    var cartItem = []
    const updatedCart = await Cart.findByIdAndUpdate(
      cartID,
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
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params
    const cartDetails = await Cart.findOne({ customerID: id })
      .where('status')
      .equals('active')
    let prevCartItem = cartDetails.cartItem
    console.log(cartDetails)
    const cartID = cartDetails._id
    var cartItem = []
    async function checkCart() {
      await prevCartItem.map((item, index) => {
        if (item.item.toString() !== req.body.productID) {
          cartItem.push({ item: item.item._id, quantity: item.quantity })
        }
      })
      const updatedCart = await Cart.findByIdAndUpdate(
        cartID,
        {
          cartItem: cartItem,
        },
        { new: true },
      )
      if (!updatedCart) {
        return res.status(httpStatus.NOT_FOUND).send('updatedCart not found!!')
      }
      return res.status(httpStatus.OK).json({ updatedCart })
    }
    checkCart()
  } catch (error) {
    next(error)
  }
}
exports.list = async (req, res, next) => {
  let cart = []
  let Total = 0
  function processCartList(item, index) {
    cart.push({
      productID: item.item._id,
      productName: item.item.productName,
      quantity: item.quantity,
      price: item.item.price * item.quantity,
    })
  }
  function calculateTotalPrice(item, index) {
    Total += item.price
  }
  console.log(req.params)
  try {
    const { id } = req.params
    const cartList = await Cart.findOne({ customerID: id })
      .select('-__v')
      .populate({ path: 'cartItem.item', model: Product })
    if (!cartList) {
      throw Error('cartList not found!!')
    }
    const cartItem = cartList.cartItem
    cartItem.forEach(processCartList)
    cart.forEach(calculateTotalPrice)
    return res.status(httpStatus.OK).json({ cart, Total })
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
