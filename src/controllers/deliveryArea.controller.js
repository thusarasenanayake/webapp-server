const DeliveryArea = require('../models/deliveryArea.model')
const Order = require('../models/order.model')
const httpStatus = require('http-status')

//add new city
exports.create = async (req, res, next) => {
  try {
    console.log(req.body)
    const city = await DeliveryArea.findOne({ city: req.body.cityName })
    if (city) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send('City  Already exists!!')
    } else {
      const city = new DeliveryArea({
        city: req.body.cityName,
        price: req.body.charges,
      })

      await city.save()

      return res.status(httpStatus.CREATED).json(DeliveryArea)
    }
  } catch (error) {
    next(error)
  }
}

//view list
exports.list = async (req, res, next) => {
  try {
    const cities = await DeliveryArea.find({})
      .where('status')
      .ne('deleted')
      .select('-__v')
    return res.status(httpStatus.OK).json({ cities })
  } catch (error) {
    next(error)
  }
}

//for frontend purpose
exports.location = async (req, res, next) => {
  try {
    const cities = await DeliveryArea.find({ status: 'active' }).select('-__v')
    if (cities.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send('City not found!!')
    }
    return res.status(httpStatus.OK).json({ cities })
  } catch (error) {
    next(error)
  }
}

// view locations
exports.view = async (req, res, next) => {
  try {
    const { id } = req.params
    const city = await DeliveryArea.findById(id)
      .where('status')
      .ne('deleted')
      .select('-__v')
    if (!city) {
      throw Error('City not found!!')
    }
    return res.status(httpStatus.OK).json({ city })
  } catch (error) {
    next(error)
  }
}

//update city info
exports.update = async (req, res, next) => {
  console.log(req.body)
  try {
    const checkCity = await DeliveryArea.findOne({
      city: req.body.city,
    }).select('_id')
    if (checkCity) {
      if (checkCity._id.toString() !== req.params.id) {
        return res.status(httpStatus.CONFLICT).send('exit')
      }
    }
    const city = await DeliveryArea.findById(req.params.id)
    if (city.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send('No entry found')
    }
    const cityUpdate = await DeliveryArea.findByIdAndUpdate(
      req.params.id,
      {
        city: req.body.city,
        price: req.body.price,
        status: req.body.status,
      },
      { new: true },
    )
    console.log(cityUpdate)

    return res.status(httpStatus.OK).json({ cityUpdate, success: true })
  } catch (error) {
    next(error)
  }
}

//delete city
exports.delete = async (req, res, next) => {
  try {
    const city = await DeliveryArea.findById(req.params.id)
    console.log(city)
    if (city) {
      const city = await DeliveryArea.findByIdAndUpdate(
        req.params.id,
        {
          status: 'deleted',
        },
        { new: true },
      )
      if (!city) {
        return res.status(httpStatus.NOT_FOUND).send('No entry found')
      }
      return res.status(httpStatus.OK).json({ city, success: true })
    } else {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send('Can not Process')
    }
  } catch (error) {
    next(error)
  }
}
