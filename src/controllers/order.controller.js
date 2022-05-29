const httpStatus = require('http-status')
const { mailService } = require('../services/mail')
const Product = require('../models/product.model')
const Order = require('../models/order.model')
const OrderItems = require('../models/order-Items.model')
const DeliveryLocations = require('../models/deliveryArea.model')
const Customer = require('../models/customer.model')

exports.create = async (req, res, next) => {
  console.log(req.body)
  const data = req.body.orderData
  const user = req.user.customerID
  let orderNumber = 0
  try {
    const userDetails = await Customer.findById(user)
    if (!userDetails) {
      return res.status(httpStatus.NOT_FOUND).send('user not found!!!')
    }

    for (let i = 0; i < data.length; i++) {
      console.log(data[i])
      const productStock = await Product.findById(data[i].productID)
        .where('inStock')
        .gte(data[i].quantity)
        .populate('_id')

      if (productStock === null) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send('This order cannot create')
      }
    }

    const deliveryFee = await DeliveryLocations.findById(
      req.body.data.city,
    ).select('price')

    const orderNum = await Order.find({})
      .sort({ orderNumber: -1 })
      .limit(1)
      .select('orderNumber')

    if (orderNum.length === 0) {
      console.log('hi')
      orderNumber = 0
    } else {
      console.log('bye')
      orderNumber = orderNum[0].orderNumber
    }

    const orderItemIDs = Promise.all(
      req.body.orderData.map(async (orderItem) => {
        let itemCount = await Product.findById(orderItem.productID).populate(
          '_id',
        )
        let stocks = itemCount.inStock - orderItem.quantity
        if (stocks < 0) {
          return res
            .status(httpStatus.BAD_REQUEST)
            .send('This order cannot create')
        }
        await Product.findByIdAndUpdate(
          orderItem.productID,
          {
            inStock: stocks,
          },
          { new: true },
        )
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
    const subTotalPrice = total.reduce((a, b) => a + b, 0)
    const totalPrice = subTotalPrice + Number(deliveryFee.price)

    let today = new Date()
    today.setHours(today.getHours() + 5)
    today.setMinutes(today.getMinutes() + 30)
    console.log(today)
    //saving orders
    let order = new Order({
      orderNumber: orderNumber + 1,
      orderItem: orderItemIDsResolved,
      shippingAddress: req.body.data.shippingAddress,
      city: req.body.data.city,
      phoneNumber: req.body.data.phoneNumber,
      orderedUser: req.user.customerID,
      landmark: req.body.data.landmark,
      subTotalPrice: subTotalPrice,
      totalPrice: totalPrice,
      receiverName: req.body.data.receiverName,
      dateOrder: today,
    })

    order = await order.save()
    if (order) {
      mailService({
        type: 'order-confirmation',
        subject: 'Order Confirmation',
        message: 'Thank you for placing your order with our store',
        email: userDetails.email,
        order_id: order._id,
      })
      return res.status(httpStatus.CREATED).json({ order })
    } else {
      return res.status(httpStatus.BAD_REQUEST).send('This order cannot create')
    }
  } catch (error) {
    console.log('error')
    next(error)
  }
}

exports.allOrders = async (req, res, next) => {
  const filter = {}
  try {
    const orderList = await Order.find(filter)
      .populate('orderedUser', 'firstName lastName')
      .populate('city', 'price')
      .populate({
        path: 'orderItem',
        populate: {
          path: 'product',
          select: 'productName',
          populate: { path: 'category_id', select: 'categoryName' },
        },
      })
      .where('isActive')
      .equals('true')
      .select('-__v')
      .sort({ dateOrder: -1 })
    if (!orderList)
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json({ orderList })
  } catch (error) {
    next(error)
  }
}

exports.orderListByStatus = async (req, res, next) => {
  const filter = { status: req.params.status }
  console.log(filter)
  try {
    const orderList = await Order.find(filter)
      .populate('orderedUser', 'firstName')
      .populate({
        path: 'orderItem',
        populate: {
          path: 'product',
          select: 'productName',
          populate: { path: 'category_id', select: 'categoryName' },
        },
      })
      .where('isActive')
      .equals('true')
      .select('-__v')
      .sort({ dateOrder: -1 })
    if (!orderList)
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json({ orderList })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  console.log(req.body.status)
  console.log('status')
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true },
    )
      .select('-__v')
      .populate('orderedUser', 'firstName address email')
      .populate({
        path: 'orderItem',
        populate: {
          path: 'product',
          select: 'productName inStock',
          // populate: { path: 'category_id', select: 'categoryName' },
        },
      })
    if (!order) {
      return res.status(httpStatus.NOT_FOUND).send('Order not found!!')
    }
    if (req.body.status === 'cancelled') {
      const product = await Product.find({}).select('inStock')
      const res = order.orderItem.filter((order) =>
        product.find(
          (product) => product._id.toString() === order.product._id.toString(),
        ),
      )
      for (key in res) {
        let stocks = 0
        let id = res[key].product._id.toString()
        let product = await Product.findById(id)
        console.log(res[key])
        stocks = res[key].quantity + product.inStock
        console.log(stocks)
        let productUpdated = await Product.findByIdAndUpdate(
          id,
          {
            inStock: stocks,
          },
          { new: true },
        )
        console.log(productUpdated, 'productUpdated')
      }
    }
    if (order.orderedUser.email) {
      if (req.body.status === 'cancelled') {
        mailService({
          type: 'order-confirmation',
          subject: 'Order Cancellation',
          message: 'We are sorry. Your order is cancelled 😢😒',
          email: order.orderedUser.email,
          order_id: order._id,
        })
        return res.status(httpStatus.OK).json({ order })
      } else if (req.body.status === 'shipped') {
        mailService({
          type: 'order-confirmation',
          subject: 'Order Shipped',
          message: 'Your order is on the way. Get ready🥳',
          email: order.orderedUser.email,
          order_id: order._id,
        })
        return res.status(httpStatus.OK).json({ order })
      } else if (req.body.status === 'delivered') {
        mailService({
          type: 'order-confirmation',
          subject: 'Order Delivered',
          message:
            'Your order is delivered. Enjoy it and give us your valuable feedback',
          email: order.orderedUser.email,
          order_id: order._id,
        })
        return res.status(httpStatus.OK).json({ order })
      } else if (req.body.status === 'processing') {
        mailService({
          type: 'order-confirmation',
          subject: 'Order Accepted',
          message: 'Your order is processing. Be ready to enjoy',
          email: order.orderedUser.email,
          order_id: order._id,
        })
        return res.status(httpStatus.OK).json({ order })
      }
    }
  } catch (error) {
    next(error)
  }
}

exports.viewuserorder = async (req, res, next) => {
  try {
    console.log((req.user, 'lll'))
    const userOrder = await Order.find({
      orderedUser: req.user.customerID,
    })
      .select('-__v')
      .populate('orderedUser', 'firstName address')
      .populate({
        path: 'orderItem',
        populate: {
          path: 'product',
          select: 'productName',
          populate: { path: 'category_id', select: 'categoryName' },
        },
      })
      .where('isActive')
      .equals('true')
      .select('-__v')
      .sort({ dateOrder: -1 })
    if (!userOrder) {
      throw Error('Orders not found!!')
    }
    return res.status(httpStatus.OK).json({ userOrder })
  } catch (error) {
    next(error)
  }
}
exports.viewAOwnOrder = async (req, res, next) => {
  console.log((req.user, 'lo'))
  try {
    const order = await Order.findById(req.params.id)
      .select('-__v')
      .populate('orderedUser', 'firstName address')
      .populate('city', 'city price')
      .populate({
        path: 'orderItem',
        populate: {
          path: 'product',
          select: 'productName price',
          populate: { path: 'category_id', select: 'categoryName' },
        },
      })
      .where('isActive')
      .equals('true')
      .select('-__v')
      .sort({ dateOrder: -1 })
    if (!order) {
      throw Error('Orders not found!!')
    }
    if (order) {
      if (order.orderedUser._id.toString() === req.user.customerID) {
        return res.status(httpStatus.OK).json({ order })
      } else {
        return res.status(httpStatus.UNAUTHORIZED).send('No data found')
      }
    }
  } catch (error) {
    next(error)
  }
}
exports.viewOrder = async (req, res, next) => {
  console.log((req.user, 'lo'))
  try {
    const order = await Order.findById(req.params.id)
      .select('-__v')
      .populate('orderedUser', 'firstName address email phoneNumber')
      .populate('city', 'city price')
      .populate({
        path: 'orderItem',
        populate: {
          path: 'product',
          select: 'productName price',
          populate: { path: 'category_id', select: 'categoryName' },
        },
      })
      .where('isActive')
      .equals('true')
      .select('-__v')
      .sort({ dateOrder: -1 })
    if (!order) {
      throw Error('Orders not found!!')
    }
    return res.status(httpStatus.OK).json({ order })
  } catch (error) {
    next(error)
  }
}

exports.count = async (req, res, next) => {
  const filter = { status: 'processing' }
  try {
    Order.count(filter, function (err, count) {
      if (!count) return res.status(httpStatus.NOT_FOUND).send('No data found')
      return res.status(httpStatus.OK).json({ count })
    })
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
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
exports.remove = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndRemove(req.params.id)
    console.log(order)
    return res.status(httpStatus.OK).json({ order })
  } catch (error) {
    next(error)
  }
}
