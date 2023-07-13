
const ErrorResponse = require("../utils/errorResponse");

//Create custom error handlers
const errorHandler = (err, req, res, next)=>{
    // Setting up a spread operator to take all the properties in err and put them in error
    let error = {...err};
    error.message = err.message;
    console.log(err);

    console.log(err.stack);
    //Mongoose bad object Id
    if(err.name === 'CastError'){
        const message = `Customer not found with the id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    //Mongoose duplicate key
    if(err.name === 'MongoServerError'){
        const message = `Customer already exists with name`;
        error = new ErrorResponse(message, 400);

    }
    //Mongoose Validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);

    }

    res.status(error.statusCode || 500).json({
        success:false,
        error: error.message || "Server Error"

    })
}

module.exports = errorHandler;