const mongoose =require('mongoose');
const config = require('../config');

exports.start = () => {
    mongoose.connect(config.mongoUri, (err) => {
        if(!err){
            console.log('Connected to MongoDB!!!');
        }else{ 
            console.log('Failed to Connect MongoDB!!!'); 
            throw err;
        }
     })
};