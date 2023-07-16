const crypto =require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Please add a name'],
        unique:true, 
        trim: true,
        maxlength:[50, 'Name can not be more than 50 characters']
    },
    email:{
        type:String,
        required: [true, "please enter email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please use valid email address'],
        unique:true, 
        trim: true,
    },
    role: {
        type:String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password:{
        type:String,
        required: [true, 'Please add a password'],
        minlength:[8, '`Password can not be less than 8 characters'],
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//Encrypt password using bcrypt before saving to databse
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password =  await bcrypt.hash(this.password, salt);
});

// //Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// //match user entered password and hash password in database
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//generate and hash password token
UserSchema.methods.getResetPasswordToken = function(){
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //Expires in 5 minutes
    this.resetPasswordExpire = Date.now() + 5 * 60*1000;

    return resetToken;
}
module.exports = mongoose.model('User', UserSchema)