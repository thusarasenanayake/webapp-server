const express = require("express");
const morgan =require("morgan");

const config = require("../config");
const apiRouter = require('../routes/api');
const errorHandler = require('../middlewares/errorHandler');
const authjwt = require('../middlewares/jwt');
const app = express();

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(morgan('combined')); //logger
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(function (req,res,next){
    console.log('Logged');
    next();
})


app.get('/',(req,res)=>{
    return res.json({message: "Hello"});
});
app.use(authjwt());
app.use('/api',apiRouter);
app.use(errorHandler.handleError);

exports.start = () =>{
    app.listen(config.port,(err)=>{
        if(err){
            console.log('Error: ${err}');
            process.exit(-1);
        }
        console.log('Backend Server is working at port', config.port);
    })
}