const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
const User = require('../models/Users');

// @desc Post Register user
// @route Post /api/v1/auth/register
// @access Public- meaning one does not need a token to register

exports.register = asyncHandler(async(req, res, next)=>{
        const {name, email, password, role}  =req.body;
        const user = await User.create({
            name,email,password,role
        });

       sendTokenResponse(user, 200, res);
        
        
});

// @desc login  user
// @route login /api/v1/auth/login
// @access Public- meaning one does not need a token to register

exports.login = asyncHandler(async(req, res, next)=>{
        const { email, password}  =req.body;

        //Validate email and password
        if (!email || !password) {
            return next(new ErrorResponse(`Please  provide email and password`, 400));       
        }
        //Check if user exist
        const user = await User.findOne({email: email}).select('+password');
        if(!user){
            return next(new ErrorResponse(`Invalid credintials`, 401));       
        }

        //Check if password match (entered & login)
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new ErrorResponse(`Invalid credintials`, 401));       
            
        }

       sendTokenResponse(user, 200, res);
});


//Get token from model and creates cookie and then sends response
const sendTokenResponse = (user, statusCode, res)=> {
        const token = user.getSignedJwtToken();
        const options = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*1*24*60*1000),
            httpOnly:true
        }
        if(process.env.NODE_ENV === 'production'){
            options.secure = true;
        }
        res.status(statusCode).cookie('token', token, options).json({success:true, token})

}

// @desc Current logged in user
// @route login /api/v1/auth/me
// @access Private

exports.getMyself = asyncHandler(async(req, res, next )=>{
    const user = await User.findById(req.user.id);
    console.log("here "+user);
    // console.log(req.user.id)
    res.status(200).json({
        success: true,
        data:user
    })
});


