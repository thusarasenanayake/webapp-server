const Customer = require('../models/customer.model');
const httpStatus = require('http-status');
const { query } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.create = async (req,res,next)=>{
    console.log(req.body)
    try{
        const customer = await Customer.findOne({email: req.body.email});
        if(customer){
            return res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Email  Already exists!!");
        }else{
            const customer = new Customer({
                "name": req.body.name,
                "email": req.body.email,
                "passwordHash": bcrypt.hashSync(req.body.passwordHash,10),
                "HouseNumber": req.body.houseNumber,
                "street": req.body.street,
                "city": req.body.city,
                "phoneNo": req.body.phoneNo
            });
            await customer.save();
            return res.status(httpStatus.CREATED).json({customer});
        }
    }catch (error){
        next(error);
    }
};

exports.update = async (req,res,next)=>{
    console.log(req.body)
    try{
        const customer = await Customer.findOne({email: req.body.email});
        if(!customer){
            return res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Email  Already exists!!");
        }else{
            const customer = new Customer({
                "name": req.body.name,
                "email": req.body.email,
                "passwordHash": bcrypt.hashSync(req.body.passwordHash,10),
                "HouseNumber": req.body.houseNumber,
                "street": req.body.street,
                "city": req.body.city,
                "phoneNo": req.body.phoneNo
            });
            await customer.save();
            return res.status(httpStatus.CREATED).json({customer});
        }
    }catch (error){
        next(error);
    }
};

exports.view = async (req,res,next)=>{
    try{
        const {id} = req.params;
        console.log("Requested user id",id);
        const customer = await Customer.findById(id).select("-__v");
        if(!customer){
            throw Error("User not found!!");
        }
        return res.status(httpStatus.OK).json({customer});
    }catch (error){
        next(error);
    }
};

exports.login = async (req,res,next)=>{
    try{
        const customer = await Customer.findOne({email: req.body.email});
        const secret = process.env.secret;
        if(!customer){
            return res.status(httpStatus.NOT_FOUND).send("User not found!!");
        }
        if(customer && bcrypt.compareSync(req.body.passwordHash,customer.passwordHash)){
            const token = jwt.sign(
            {
                customerID: customer.id
            },
            secret,
            {expiresIn: '1d'}
            )
            return res.status(httpStatus.OK).send({customer: customer.name, token: token} );
        }else{
            return res.status(httpStatus.NOT_FOUND).send("Password is wrong!");
        }
    }catch (error){
        next(error);
    }
};

exports.list = async (req, res, next)=>{
    const filter ={};
    try{
        const query = Customer.find(filter).select("-passwordHash -__v -createdAt -updatedAt");
        const customer = await query.exec();
        return res.status(httpStatus.OK).json({customer});
    }catch (error){
        next(error);
    }
};

exports.remove = async (req, res, next)=>{
    try{
        const {id} = req.params;
        const query = await Customer.findByIdAndRemove(id);
        return res.status(httpStatus.OK).json({query});
    }catch (error){
        next(error);
    }
};


