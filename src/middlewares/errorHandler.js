const httpStatus = require('http-status');

//handle errors
exports.handleError = (err, _req, res, next)=>{
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
        res.json({
            error: err.message
        })
        res.end();
    }