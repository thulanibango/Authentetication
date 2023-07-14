const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
const Customers = require('../models/Customers');

//these are middlesware functions: Functions that have access to the request/response cycle

// @desc Get all Customers
// @route Get /api/v1/customer
// @access private- meaning one needs a token to get customers
exports.getCustomer = asyncHandler(async(req, res, next)=>{
        const customers = await Customers.find();
        res.status(200).json({ success:true,count:customers.length,data: customers})
})

// @desc Get single Customer
// @route Get /api/v1/customer/:id
// @access private- meaning one needs a token to get customers
exports.getSingleCustomer = asyncHandler(async (req, res, next)=>{
    let id = req.params.id;
    const customers = await Customers.findById(id);
    if (!customers) {
        return next(new ErrorResponse(`Customer not found with the id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success:true,
        data: customers
    })     
})

// @desc Add a Customer
// @route Post /api/v1/customer
// @access private- meaning one needs a token to add a customer
exports.addCustomer = asyncHandler(async(req, res, next)=>{
    //adding user req.body
    req.body.user = req.user.id;

    //check for admin customers
    const adminCustomer = await Customers.findOne({user:req.user.id})
    const authRole =req.user.role;
    //if the user is not an super admin(sAdmin), can add one customer
    if(adminCustomer && authRole != 'admin'){
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already added a customer`, 400));
    }


        const customers = await Customers.create(req.body);
        res.status(200).json({ success:true,data: customers})    
});

// @desc Update single Customer
// @route Put /api/v1/customers/:id
// @access private- meaning one needs a token to update a customer
exports.updateCustomer = asyncHandler(async (req, res, next)=>{
    let id = req.params.id;
        const customers = await Customers.findByIdAndUpdate(id, req.body, {new:true,runValidators:true});
         if (!customers) {
            return next(new ErrorResponse(`Customer not found with the id of ${req.params.id}`, 404));
        }       
        res.status(201).json({success:true,data: customers})

})

// @desc Delete single Customer
// @route delete /api/v1/customers/:id
// @access private- meaning one needs a token to delete customer
exports.deleteCustomer = asyncHandler(async(req, res, next)=>{
    let id = req.params.id;
    const customers = await Customers.findByIdAndDelete(id);
         if (!customers) {
            return next(new ErrorResponse(`Customer not found with the id of ${req.params.id}`, 404));
        }
        res.status(201).json({
        success:true,
        data: "Deleted Successfully"
        })
})

