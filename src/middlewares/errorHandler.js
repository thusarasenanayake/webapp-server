const httpStatus = require('http-status');

//handle errors
exports.handleError = (err, _req, res, next)=>{
	console.log(err.name);
    
    if (err.name === "UnauthorizedError") {
		return res.status(httpStatus.UNAUTHORIZED).json({
			error: err.message,
		});
	}

	if (err.name === "ValidationError") {
		return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
			error: err.message,
		});
	}
    
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
        res.json({
            error: err.message
        })
        res.end();
    }