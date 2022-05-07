const Product = require('../models/product.model')
const Order = require('../models/order.model')
const OrderItems = require('../models/order-Items.model')
const DeliveryLocations = require('../models/deliveryArea.model')
const Customer = require('../models/customer.model');
const httpStatus = require('http-status');
const permission = require('../middlewares/permissionLevel');


function bubbleSort(arr1,arr2){
  var i, j;
  var len = arr1.length;
  var isSwapped = false;
  for(i =0; i < len; i++){
    isSwapped = false;
    for(j = 0; j < len; j++){
      if (arr1[j] < arr1[j + 1]) {
        var temp1 = arr1[j]
        var temp2 = arr2[j]
        arr1[j] = arr1[j + 1];
        arr1[j + 1] = temp1;
        arr2[j] = arr2[j + 1];
        arr2[j + 1] = temp2;
        isSwapped = true;
        }
    }
    if(!isSwapped){
      break;
    }
  }
  console.log(arr1,arr2);
 
}

exports.income = async (req, res, next) => {
  let totalPrice = []
  let dateArray =[]
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
  console.log(endDateNew, startDateNew);
  
  function dateRange(startDate, endDate, steps = 1) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}
  const dates = dateRange(startDateNew, endDateNew);
  
  try {
    for (let i = 0; i < dates.length; i++) {
      var orders = await Order.find({ dateOrder:  { $gte: dates[i], $lte: dates[i+1]}}).select('totalPrice').where('status').equals('delivered')
      let price = 0;
          for (let j = 0; j < orders.length; j++) {
            price += orders[j].totalPrice
      }
      totalPrice.push(price)
      dateArray.push(dates[i].toDateString())
      }
    if (!orders)
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json({dateArray,totalPrice })
  } catch (error) {
    next(error)
  }
}

exports.delivery = async (req, res, next) => {
  let cityName = [] 
  let cityCount =[]
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
    console.log(endDateNew,startDateNew);
  try {
    console.log(date[0].startDate,date[0].endDate);
    const orderedCity = await Order.find({ dateOrder: { $gte: startDateNew, $lte: endDateNew }}
).select('city').where('status').equals('delivered')
    const cities = await DeliveryLocations.find()
    .select('_id city')   
    .where('status')
      .equals('active')
    let count =0;
    if (orderedCity.length>0){
      for (let j = 0; j < cities.length; j++) {
      cityName.push(cities[j].city)
      count =0;
      for (let i = 0; i < orderedCity.length; i++) {
        if (cities[j]._id.toString() === orderedCity[i].city.toString()) {
          count = count + 1
        }
      }
      cityCount.push(count)
      }
      }
  bubbleSort(cityCount, cityName)
    
    if (!orderedCity || !cities)
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json({cityCount,cityName })
  } catch (error) {
    next(error)
  }
}

exports.products = async (req, res, next) => {
  await permission(req.user, res, true);//admin

  let productNm = [] 
  let productCount =[]
  let orderItem=[]
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
    console.log(endDateNew,startDateNew);
  try {
    const orderItems = await Order.find({ dateOrder: { $gte:startDateNew , $lte: endDateNew }}).select('orderItem').where('status').equals('delivered')
    for (let j = 0; j < orderItems.length; j++){
      for (let i = 0; i < orderItems[j].orderItem.length; i++){
        let id =orderItems[j].orderItem[i].toString()
        let orderListArray = await OrderItems.findById(id)
        .populate('product', 'productName')
        .select('quantity dateOrder')
        orderItem.push(orderListArray)
      }
    }
    const productList = await Product.find()
    .select('_id productName')   
    .where('status')
    .equals('active')
    let count =0;
    if (orderItem.length>0){
      for (let j = 0; j < productList.length; j++) {
      productNm.push(productList[j].productName)
      count =0;
      for (let i = 0; i < orderItem.length; i++) {
        if(productList[j]._id.toString()===orderItem[i].product._id.toString()){
          count = count + orderItem[i].quantity
        }
      }
      productCount.push(count)
      }
      }
    const orderList = await OrderItems.find({ dateOrder: { $gte: date[0].startDate, $lte: date[0].endDate }})
      .populate('product', 'productName')
      .select('quantity dateOrder')
      .sort({ dateOrder: -1 })
      bubbleSort(productCount, productNm)
     
      
    if (!orderList)
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json({productCount,productNm })
  } catch (error) {
    next(error)
  }
}
  
exports.customer = async (req, res, next) => {
  let customerName = [ ] 
  let orderCount = []
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
    console.log(endDateNew,startDateNew);
  try {
    const orderedUsers = await Order.find({ dateOrder: { $gte: startDateNew, $lte: endDateNew }} )
      .select('totalPrice user').where('status').equals('delivered')
    
    const customer = await Customer.find()
      .select('_id firstName lastName') 
      .where('status')
      .equals('active')
    let count = 0;
    if (orderedUsers.length > 0) {
      customerName = [ ]
      for (let j = 0; j < customer.length; j++) {
        // customerName.push([{id:customer[j]._id.toString(),firstName:customer[j].firstName,lastName:customer[j].lastName}])
        count = 0;
        price = 0;
      for (let i = 0; i < orderedUsers.length; i++) {
        if (customer[j]._id.toString() === orderedUsers[i].user.toString()) {
          count = count + 1
          price += orderedUsers[i].totalPrice
          }
        }
        customerName.push([{id:customer[j]._id.toString(),firstName:customer[j].firstName,lastName:customer[j].lastName,count:count,price:price}])
        orderCount.push(count)
        }
      }
  bubbleSort(orderCount, customerName)
    
    if (!orderedUsers || !customer)
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json({orderCount,customerName })
  } catch (error) {
    next(error)
  }
}