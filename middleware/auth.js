const jwt = require('jsonwebtoken');
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/Users')


//protect routes
// @desc login  user
// @route login /api/v1/auth/login
// @access Public- meaning one does not need a token to register

exports.protect =asyncHandler(async(req, res, next )=>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token=req.headers.authorization.split(' ')[1]
    }
    // else if(req.cookie.token){
    //     token= req.cookies.token

    // }

    //Make sure token exists
    if(!token){
        return next(new ErrorResponse('Not authorise to access this route', 401));    
    }

    try {
        //verify token
        const decoded =jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);
        next()
        
    } catch (error) {
        return next(new ErrorResponse('Not authorise to access this route', 401));    

        
    }
});

// Granting access to specific roles

exports.authorize = (...roles)=>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User ${req.user.role} is not authorized to access this route`, 403));    
        }
        next();
    }
}
