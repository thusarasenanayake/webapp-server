const httpStatus = require('http-status')
const Product = require('../models/product.model')
const Order = require('../models/order.model')
const OrderItems = require('../models/order-Items.model')

exports.create = async (req, res, next) => {
  const data = req.body.orderData;
    try {
        for (let i = 0; i < data.length; i++) {
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
    
        const orderItemIDs = Promise.all(
          req.body.orderData.map(async (orderItem) => {
            let itemCount = await Product.findById(orderItem.productID).populate(
              '_id',
            )
            await Product.findByIdAndUpdate(
              orderItem.productID,
              {
                inStock: itemCount.inStock - orderItem.quantity,
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
        const totalPrices = total.reduce((a, b) => a + b, 0)
    
        //saving orders
        let order = new Order({
          orderItem: orderItemIDsResolved,
          shippingAddress: req.body.data.shippingAddress,
          city: req.body.city,
          phoneNumber: req.body.data.phoneNumber,
          user: req.params.id,
          landmark: req.body.data.landmark,
          totalPrice: totalPrices,
          receiverName: req.body.receiverName,
        })
        order = await order.save()
        if (!order)
          return res.status(httpStatus.BAD_REQUEST).send('This order cannot create')
        return res.status(httpStatus.CREATED).json({ order })
      } catch (error) {
        console.log('error');
        next(error)
      }
}

exports.allOrders = async (req, res, next) => {
  const filter = {}
  try {
    const orderList = await Order.find(filter)
      .populate('user', 'firstName')
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
exports.orderCategoryLists = async (req, res, next) => {
 console.log(req.params.status);
  const filter = {status:req.params.status}
  console.log(filter);
  try {
    const orderList = await Order.find(filter)
      .populate('user', 'firstName')
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
  console.log(req.body, req.params.id, 'aaa')
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true },
    )
      .select('-__v')
      .populate('user', 'firstName address')
      .populate({
        path: 'orderItem',
        populate: {
          path: 'product',
          select: 'productName',
          populate: { path: 'category_id', select: 'categoryName' },
        },
      })
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
      .populate('user', 'firstName address')
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

exports.viewAOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .select('-__v')
      .populate('user', 'firstName address')
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
