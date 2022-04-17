const DeliveryArea = require("../models/deliveryArea.model");
const httpStatus = require("http-status");
exports.create = async (req, res, next) => {
  try {
    console.log(req.body);
    const city = await DeliveryArea.findOne({ city: req.body.cityName });
    if (city) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send("City  Already exists!!");
    } else {
      const city = new DeliveryArea({
        city: req.body.cityName,
        price: req.body.charges,
      });

      await city.save();

      return res.status(httpStatus.CREATED).json(DeliveryArea );
    }
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const query = DeliveryArea.find({})
      .where('status')
      .ne('deleted')
      .select('-__v')
    const cities = await query.exec()
    return res.status(httpStatus.OK).json({ cities })
  } catch (error) {
    next(error)
  }
}

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


exports.update = async (req, res, next) => {
  try {
    const city = await DeliveryArea.findOne({ city: req.body.city })
    console.log(city)
    if (city) {
      const city = await DeliveryArea.findByIdAndUpdate(
        req.params.id,
        {
          city: req.body.city,
          price: req.body.price,
          status:req.body.status
        },
        { new: true },
      )
      if (!city) {
        return res.status(httpStatus.NOT_FOUND).send("No entry found")
      }
      return res.status(httpStatus.OK).json({ city, success: true })
    } else {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send('Can not Process')
    }
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const city = await DeliveryArea.findById(req.params.id)
    console.log(city)
    if (city) {
      const city = await DeliveryArea.findByIdAndUpdate(
        req.params.id,
        {
          status:'deleted'
        },
        { new: true },
      )
      if (!city) {
        return res.status(httpStatus.NOT_FOUND).send("No entry found")
      }
      return res.status(httpStatus.OK).json({ city, success: true })
    } else {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send('Can not Process')
    }
  } catch (error) {
    next(error)
  }
}