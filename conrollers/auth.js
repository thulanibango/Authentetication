const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
const User = require('../models/Users');
const sendEmail = require('../utils/sendEmail');
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



// @desc Current logged in user
// @route Post  /api/v1/auth/me
// @access Private

exports.getMyself = asyncHandler(async(req, res, next )=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data:user
    })
});

// @desc Logout user / clearing cookie
// @route Post  /api/v1/auth/logout
// @access Public

exports.logout = asyncHandler(async(req, res, next )=>{
    console.log(res);
 res.clearCookie('token');
    res.status(200).json({
        success: true,
        data:{}
    })
});
// @desc Forgot password
// @route Post /api/v1/auth/forgotpassword
// @access public

exports.forgotPassword = asyncHandler(async(req, res, next )=>{
    const user = await User.findOne({email :req.body.email});
    if(!user){
        return next(new ErrorResponse(`No user with that email`, 404));       
    }

    // Get the reset password token
    const resetToken = user.getResetPasswordToken();
    await user.save({validatedBeforeSave:false});
    //create reset url 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You have requested to reset your password: \n\n please click here to do so ${resetUrl}`;

    try {
        await sendEmail({
            email:user.email,
            subject: 'Password reset token',
            message
        });
        res.status(200).json({success:true, data:'Email sent'});
    } catch (error) {
        console.log(error);
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});
        return next(new ErrorResponse('Email could not be sent', 500))
    }
    console.log(resetToken);
    res.status(200).json({
        success: true,
        data:user
    })
});


// @desc Reset password
// @route Put /api/v1/auth/forgotpassword/:resettoken
// @access public

exports.resetPassword = asyncHandler(async(req, res, next )=>{
    //Get hashed token
    const resetPasswordToken =crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt: Date.now()}
    });
    if(!user){
        return next(new ErrorResponse(`Invalid token`, 400));       
    }
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

  sendTokenResponse(user,200 ,res);
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



