const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Please add a name'],
        unique:true, 
        trim: true,
        maxlength:[50, 'Name can not be more than 50 characters']
    },
    email:{
        type:String,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please use valid email address'],
        unique:true, 
        trim: true,
        maxlength:[50, 'Email can not be more than 50 characters']
    },
    phone:{
        type:String,
        required: [true, 'Please add a Contact'],
        unique:true, 
        trim: true,
        maxlength:[50, 'Email can not be more than 50 characters']
    },
    address:{
        type:String,
        required: [true, 'Please add a Address'],
    },
    description:{
        type:String,
        required: [true, 'Please add a descriptiomn'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }



})

module.exports =mongoose.model('Customers', CustomerSchema)