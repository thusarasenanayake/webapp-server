const Product = require('../models/product.model')
const Order = require('../models/order.model')
const OrderItems = require('../models/order-Items.model')
const DeliveryLocations = require('../models/deliveryArea.model')
const Category = require('../models/category.model')
const Customer = require('../models/customer.model')
const httpStatus = require('http-status')
const permission = require('../middlewares/permissionLevel')

function bubbleSort(arr1, arr2) {
  var i, j
  var len = arr1.length
  var isSwapped = false
  for (i = 0; i < len; i++) {
    isSwapped = false
    for (j = 0; j < len; j++) {
      if (arr1[j] < arr1[j + 1]) {
        var temp1 = arr1[j]
        var temp2 = arr2[j]
        arr1[j] = arr1[j + 1]
        arr1[j + 1] = temp1
        arr2[j] = arr2[j + 1]
        arr2[j + 1] = temp2
        isSwapped = true
      }
    }
    if (!isSwapped) {
      break
    }
  }
  console.log(arr1, arr2)
}

exports.income = async (req, res, next) => {
  await permission(req.user, res, true) //admin

  const date = req.body.state
  let startDateNew = new Date(date[0].startDate)
  startDateNew.setHours(startDateNew.getHours() + 5)
  startDateNew.setMinutes(startDateNew.getMinutes() + 30)

  let endDateNew = new Date(date[0].endDate)
  endDateNew.setDate(endDateNew.getDate() + 2)
  endDateNew.setHours(endDateNew.getHours() + 5)
  endDateNew.setMinutes(endDateNew.getMinutes() + 29)
  endDateNew.setSeconds(59)
  endDateNew.setMilliseconds(999)
  console.log(endDateNew, startDateNew)

  function dateRange(startDate, endDate, steps = 1) {
    const dateArray = []
    const currentDate = startDate

    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate))
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getUTCDate() + steps)
    }
    return dateArray
  }
  const dates = dateRange(startDateNew, endDateNew)

  try {
    let totalIncome = []
    for (let i = 0; i < dates.length; i++) {
      var orders = await Order.find({
        dateOrder: { $gte: dates[i], $lte: dates[i + 1] },
      })
        .select('totalPrice')
        .where('status')
        .equals('delivered')
      let price = 0
      for (let j = 0; j < orders.length; j++) {
        price += orders[j].totalPrice
      }
      if (price !== 0) {
        totalIncome.push([dates[i].toDateString(), price])
      }
    }
    if (!orders) return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json({ totalIncome })
  } catch (error) {
    next(error)
  }
}

exports.productIncome = async (req, res, next) => {
  await permission(req.user, res, true) //admin

  let products = []
  let orderItem = []
  const date = req.body.state
  let startDateNew = new Date(date[0].startDate)
  startDateNew.setHours(startDateNew.getHours() + 5)
  startDateNew.setMinutes(startDateNew.getMinutes() + 30)

  let endDateNew = new Date(date[0].endDate)
  endDateNew.setDate(endDateNew.getDate() + 1)
  endDateNew.setHours(endDateNew.getHours() + 5)
  endDateNew.setMinutes(endDateNew.getMinutes() + 29)
  endDateNew.setSeconds(59)
  endDateNew.setMilliseconds(999)
  try {
    const orders = await Order.find({
      dateOrder: { $gte: startDateNew, $lte: endDateNew },
    })
      .select('orderItem')
      .where('status')
      .equals('delivered')
    for (let j = 0; j < orders.length; j++) {
      for (let i = 0; i < orders[j].orderItem.length; i++) {
        let id = orders[j].orderItem[i].toString()
        let orderListArray = await OrderItems.findById(id)
          .populate('product', 'productName')
          .select('quantity')
        orderItem.push(orderListArray)
      }
    }
    const productList = await Product.find()
      .select('_id productName price')
      .where('status')
      .equals('active')
    let count = 0
    if (orderItem.length > 0) {
      for (let j = 0; j < productList.length; j++) {
        count = 0
        for (let i = 0; i < orderItem.length; i++) {
          if (
            productList[j]._id.toString() ===
            orderItem[i].product._id.toString()
          ) {
            count = count + orderItem[i].quantity
          }
        }
        if (count !== 0) {
          products.push([
            productList[j].productName,
            productList[j].price,
            count,
          ])
        }
      }
    }
    if (!orders) return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json({ products })
  } catch (error) {
    next(error)
  }
}

exports.delivery = async (req, res, next) => {
  await permission(req.user, res, true) //admin

  let cityName = []
  let cityDetails = []
  const date = req.body.state
  let startDateNew = new Date(date[0].startDate)
  startDateNew.setHours(startDateNew.getHours() + 5)
  startDateNew.setMinutes(startDateNew.getMinutes() + 30)

  let endDateNew = new Date(date[0].endDate)
  endDateNew.setDate(endDateNew.getDate() + 1)
  endDateNew.setHours(endDateNew.getHours() + 5)
  endDateNew.setMinutes(endDateNew.getMinutes() + 29)
  endDateNew.setSeconds(59)
  endDateNew.setMilliseconds(999)
  try {
    const orderedCity = await Order.find({
      dateOrder: { $gte: startDateNew, $lte: endDateNew },
    })
      .select('city')
      .where('status')
      .equals('delivered')
    const cities = await DeliveryLocations.find()
      .select('_id city')
      .where('status')
      .equals('active')
    let count = 0
    if (orderedCity.length > 0) {
      for (let j = 0; j < cities.length; j++) {
        cityName.push([cities[j].city])
        count = 0
        for (let i = 0; i < orderedCity.length; i++) {
          if (cities[j]._id.toString() === orderedCity[i].city.toString()) {
            count = count + 1
          }
        }
        cityDetails.push([cities[j].city, count])
      }
    }
    // bubbleSort(cityCount, cityName)
    if (!orderedCity || !cities)
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json(cityDetails)
  } catch (error) {
    next(error)
  }
}

exports.popularProducts = async (req, res, next) => {
  await permission(req.user, res, true) //admin

  let productDetails = []
  let orderItem = []
  //set date format
  const date = req.body.state
  let startDateNew = new Date(date[0].startDate)
  startDateNew.setHours(startDateNew.getHours() + 5)
  startDateNew.setMinutes(startDateNew.getMinutes() + 30)

  let endDateNew = new Date(date[0].endDate)
  endDateNew.setDate(endDateNew.getDate() + 1)
  endDateNew.setHours(endDateNew.getHours() + 5)
  endDateNew.setMinutes(endDateNew.getMinutes() + 29)
  endDateNew.setSeconds(59)
  endDateNew.setMilliseconds(999)
  console.log(endDateNew, startDateNew)
  try {
    //check orders on searched date
    const orderItems = await Order.find({
      dateOrder: { $gte: startDateNew, $lte: endDateNew },
    })
      .select('orderItem')
      .where('status')
      .equals('delivered')
    for (let j = 0; j < orderItems.length; j++) {
      for (let i = 0; i < orderItems[j].orderItem.length; i++) {
        let id = orderItems[j].orderItem[i].toString()
        let orderListArray = await OrderItems.findById(id)
          .populate('product', 'productName')
          .select('quantity dateOrder')
        orderItem.push(orderListArray)
      }
    }
    //get product list
    const productList = await Product.find()
      .select('_id productName')
      .where('status')
      .equals('active')
    let count = 0

    //calculate ordered count with product name by comparing product ids
    if (orderItem.length > 0) {
      for (let j = 0; j < productList.length; j++) {
        count = 0
        for (let i = 0; i < orderItem.length; i++) {
          if (
            productList[j]._id.toString() ===
            orderItem[i].product._id.toString()
          ) {
            count = count + orderItem[i].quantity
          }
        }
        // creating array of popular product
        productDetails.push([productList[j].productName, count])
      }
    }
    if (!orderItems)
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json(productDetails)
  } catch (error) {
    next(error)
  }
}
exports.order = async (req, res, next) => {
  let products = []
  let category = []
  try {
    const customer = await Customer.findById(req.params.id)
    if (!customer) {
      return res.status(httpStatus.NOT_FOUND).send('user not found')
    }
    const orderList = await Order.find({
      $and: [
        {
          orderedUser: req.params.id,
          isActive: true,
          status: 'delivered',
        },
      ],
    })
      .populate({
        path: 'orderItem',
        populate: {
          path: 'product',
          select: 'productName',
          populate: { path: 'category_id', select: 'categoryName' },
        },
      })
      .sort({ dateOrder: -1 })

    const productList = await Product.find({ status: 'active' }).select(
      '_id productName',
    )
    const categoryList = await Category.find({ status: 'active' }).select(
      '_id categoryName',
    )

    //calculate most ordered products with quantity
    for (let k = 0; k < productList.length; k++) {
      let qty = 0
      for (let i = 0; i < orderList.length; i++) {
        for (let j = 0; j < orderList[i].orderItem.length; j++) {
          if (
            orderList[i].orderItem[j].product._id.toString() ===
            productList[k]._id.toString()
          ) {
            qty += orderList[i].orderItem[j].quantity
          }
        }
      }
      if (qty > 0) products.push([productList[k].productName, qty])
    }

    //calculate most ordered category with quantity
    for (let k = 0; k < categoryList.length; k++) {
      let qty = 0
      for (let i = 0; i < orderList.length; i++) {
        for (let j = 0; j < orderList[i].orderItem.length; j++) {
          if (
            orderList[i].orderItem[j].product.category_id._id.toString() ===
            categoryList[k]._id.toString()
          ) {
            qty += 1
          }
        }
      }
      if (qty > 0) category.push([categoryList[k].categoryName, qty])
    }

    return res.status(httpStatus.OK).json({ orderList, products, category })
  } catch (error) {
    next(error)
  }
}
exports.customer = async (req, res, next) => {
  await permission(req.user, res, true) //admin

  let customers = []
  //set date format
  const date = req.body.state
  console.log(date)
  let startDateNew = new Date(date[0].startDate)
  startDateNew.setHours(startDateNew.getHours() + 5)
  startDateNew.setMinutes(startDateNew.getMinutes() + 30)

  let endDateNew = new Date(date[0].endDate)
  endDateNew.setDate(endDateNew.getDate() + 1)
  endDateNew.setHours(endDateNew.getHours() + 5)
  endDateNew.setMinutes(endDateNew.getMinutes() + 29)
  endDateNew.setSeconds(59)
  endDateNew.setMilliseconds(999)
  try {
    //check orders on searched date
    const orders = await Order.find({
      dateOrder: { $gte: startDateNew, $lte: endDateNew },
      status: 'delivered',
    }).select('totalPrice orderedUser')

    const customer = await Customer.find({
      status: 'active',
    }).select('_id firstName lastName')

    let count = 0
    if (orders.length > 0) {
      for (let j = 0; j < customer.length; j++) {
        count = 0
        price = 0
        for (let i = 0; i < orders.length; i++) {
          if (customer[j]._id.toString() === orders[i].orderedUser.toString()) {
            count = count + 1
            price += orders[i].totalPrice
          }
        }
        customers.push([
          {
            id: customer[j]._id.toString(),
            firstName: customer[j].firstName,
            lastName: customer[j].lastName,
            count: count,
            price: price,
          },
        ])
      }
    }

    // bubbleSort(orderCount, customers)
    if (!orders || !customer)
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json(customers)
  } catch (error) {
    next(error)
  }
}

exports.customersFavProducts = async (req, res, next) => {
  await permission(req.user, res, true) //admin

  let customers = []

  try {
    const customer = await Customer.find({
      status: 'active',
    }).select('_id firstName')

    const products = await Product.find({
      status: 'active',
    }).select('_id productName')
    const orders = await Order.find({
      status: 'delivered',
    })
      .select('orderedUser orderItem')
      .populate({ path: 'orderedUser', model: Customer, select: 'firstName' })
      .populate({ path: 'orderItem', model: OrderItems })
    let qty = 0

    for (let i = 0; i < customer.length; i++) {
      //pushing customer name to 2D array
      customers.push([customer[i].firstName])
      for (let k = 0; k < products.length; k++) {
        qty = 0 //resetting qty
        for (let l = 0; l < orders.length; l++) {
          for (let j = 0; j < orders[l].orderItem.length; j++) {
            //compare product id and user id
            if (
              products[k]._id.toString() ===
                orders[i].orderItem[j].product.toString() &&
              customer[i]._id.toString() ===
                orders[l].orderedUser._id.toString()
            ) {
              qty += orders[i].orderItem[j].quantity
            }
          }
        }
        customers[i].push([products[k].productName, qty])
      }
    }

    return res.status(httpStatus.OK).json(customers)
  } catch (error) {
    next(error)
  }
}
