const Product = require('../models/product.model');
const Category = require('../models/category.model');
const httpStatus = require('http-status');
const { query } = require('express');
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split('').join('-');
      cb(null, fileName + '-' + Date.now());    //cb - call back
    }
  })
  
  const upload = multer({ storage: storage })

exports.create = async (req, res, next)=>{
    const fileName = req.body.image;
    const basePath = req.protocol + '://' + req.get('host') + '/public/uploads/'+req.body.image;
    try{
        const category = await Category.findById(req.body.category);
        if(!category){
            console.log(category,req.body.name)
            return res.status(httpStatus.BAD_REQUEST).json('Invalid Category');
        }else{
            const productData = new Product({
                "name": req.body.name,
                "description": req.body.description,
                "richDescription": req.body.richDescription,
                "image": basePath,
                "price": req.body.price,
                "category": req.body.category,
                "countInstock": req.body.countInstock,
                "rating": req.body.rating,
                "dateCreated": req.body.dateCreated
            });
            await productData.save();
            return res.status(httpStatus.CREATED).json({productData});
        }
    }catch (error){
        next(error);
    }
};

exports.view = async (req,res,next)=>{
    try{
        const {id} = req.params;
        const product = await Product.findById(id).select("-__v").populate({ path: 'category', model: Category });
        if(!product){
            throw Error("Product not found!!");
        }
        return res.status(httpStatus.OK).json({product});
    }catch (error){
        next(error);
    }
};

exports.list = async (req, res, next)=>{
    try{
        let filter = {};
        if(req.query.categories){
            filter = {category: req.query.categories.split(',')}
        }
        const query = Product.find(filter).select("-__v").populate({ path: 'category', model: Category });
        const products = await query.exec();
        return res.status(httpStatus.OK).json({products});
    }catch (error){
        next(error);
    }
};

//update countStocks, instock status and price
exports.updateCIP = async (req,res,next)=>{
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                countInstock: req.body.countInstock,
                Instock: req.body.instock,
                price: req.body.price
            },
            {new:true}
        )
        if(!product){
            return res.status(httpStatus.NOT_FOUND).send('Product not found!!');
        }
        return res.status(httpStatus.OK).json({product});
    }catch (error){
        next(error);
    }
};

exports.remove = async (req, res, next)=>{
    try{
        const {id} = req.params;
        const query = await Product.findByIdAndRemove(id);
        return res.status(httpStatus.OK).json({query});
    }catch (error){
        next(error);
    }
};
