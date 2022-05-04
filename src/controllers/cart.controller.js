const httpStatus = require('http-status')
const Cart = require('../models/cart.model')
const Product = require('../models/product.model')
const Customer = require('../models/customer.model')

exports.update = async (req, res, next) => {
  try {
    const id = req.user.customerID
    const productID = req.body.productID
    const qty = req.body.quantity

    let isMatched = false
    const customer = await Customer.findById(id)
    const product = await Product.findById(productID).select('inStock')
         
    if (product.inStock <qty) {
        return res.status(httpStatus.FORBIDDEN).send('product not available')
    }
    if (customer) {
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
    const  id  = req.user.customerID
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
  console.log('halo',req.user);
  try {
    const id = req.user.customerID
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
exports.updateQuantity = async (req, res, next) => {
  console.log(req.body, 'qqqq')
  try {
    const id = req.user.customerID
    const cartDetails = await Cart.findOne({ customerID: id })
      .where('status')
      .equals('active')
    let prevCartItem = cartDetails.cartItem
    console.log(cartDetails)
    const cartID = cartDetails._id
    var cartItem = []
    async function checkCart() {
      await prevCartItem.map((item, index) => {
        if (item.item.toString() !== req.body.productData.productID) {
          cartItem.push({ item: item.item._id, quantity: item.quantity })
        } else if (item.item.toString() === req.body.productData.productID) {
          cartItem.push({
            item: item.item._id,
            quantity: req.body.productData.quantity,
          })
        }
      })
      console.log(cartItem, 'hello')
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
  let availableCartItem = []
  let unavailableCartItem = []
  let availableTotalPrice = 0
  let unAvailableTotalPrice = 0
  function processCartList(item, index) {
    if (item.quantity <= item.item.inStock) {
      availableTotalPrice += item.item.price * item.quantity
      availableCartItem.push({
        productID: item.item._id,
        productName: item.item.productName,
        quantity: item.quantity,
        price: item.item.price,

        inStock: item.item.inStock,
      })
    } else {
      unAvailableTotalPrice += item.item.price * item.quantity
      unavailableCartItem.push({
        productID: item.item._id,
        productName: item.item.productName,
        quantity: item.quantity,
        price: item.item.price,
        inStock: item.item.inStock,
      })
    }
  }
  try {
    const  id  = req.user.customerID
    const cartList = await Cart.findOne({ customerID: id })
      .select('-__v')
      .populate({ path: 'cartItem.item', model: Product })

    if (!cartList) {
      throw Error('cartList not found!!')
    }
    const cartItem = cartList.cartItem
    cartItem.forEach(processCartList)

    return res.status(httpStatus.OK).json({
      availableCartItem,
      unavailableCartItem,
      availableTotalPrice,
      unAvailableTotalPrice,
    })
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
