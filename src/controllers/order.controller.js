const httpStatus = require('http-status')
const Order = require('../models/order.model')
const OrderItems = require('../models/order-Items.model')

exports.create = async (req, res, next) => {
  console.log(req.body.orderItems)
  try {
    //saving orderItems to orderItem collection
    const orderItemIDs = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItems({
          quantity: orderItem.quantity,
          product: orderItem.productID,
        })
        newOrderItem = await newOrderItem.save()
        return newOrderItem._id
      }),
    )
    const orderItemIDsResolved = await orderItemIDs

    //calculating total price from backend database
    const total = await Promise.all(
      orderItemIDsResolved.map(async (index) => {
        const orderItem = await OrderItems.findById(index).populate('product')
        const totalPrice = orderItem.product.price * orderItem.quantity
        return totalPrice
      }),
    )
    //merg array of total prices and get sum of all prices {=+orderitem*qty}[a+b+c]
    const totalPrices = total.reduce((a, b) => a + b, 0)

    //saving orders
    let order = new Order({
      orderItem: orderItemIDsResolved,
      shippingAddress: req.body.data.shippingAddress,
      // city: req.body.city,
      phoneNumber: req.body.data.phoneNumber,
      user: req.body.data.user,
      landmark: req.body.data.landmark,
      totalPrice: totalPrices,
    })
    order = await order.save()
    if (!order)
      return res.status(httpStatus.BAD_REQUEST).send('This order cannot create')
    return res.status(httpStatus.CREATED).json({ order })
  } catch (error) {
    next(error)
  }
}

exports.list = async (req, res, next) => {
  const filter = {}
  try {
    const orderList = await Order.find(filter)
      .populate('user', 'name')
      .populate({
        path: 'orderItem',
        populate: {
          path: 'product',
          select: 'name',
          populate: { path: 'category', select: 'name' },
        },
      })
      .sort({ dateOrder: -1 })
    if (!orderList)
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json({ orderList })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true },
    )
    if (!order) {
      return res.status(httpStatus.NOT_FOUND).send('Order not found!!')
    }
    return res.status(httpStatus.OK).json({ order })
  } catch (error) {
    next(error)
  }
}

exports.viewuserorder = async (req, res, next) => {
  try {
    const userOrder = await Order.find({ user: req.params.userid })
      .select('-__v')
      .populate('user', 'firstName')
      .populate({
        path: 'orderItem',
        populate: {
          path: 'product',
          select: 'productName',
          populate: { path: 'category_id', select: 'categoryName' },
        },
      })
      .sort({ dateOrder: -1 })
    if (!userOrder) {
      throw Error('Orders not found!!')
    }
    return res.status(httpStatus.OK).json({ userOrder })
  } catch (error) {
    next(error)
  }
}

exports.count = async (req, res, next) => {
  const filter = {}
  try {
    Order.count(filter, function (err, count) {
      if (!count) return res.status(httpStatus.NOT_FOUND).send('No data found')
      return res.status(httpStatus.OK).json({ count })
    })
  } catch (error) {
    next(error)
  }
}
