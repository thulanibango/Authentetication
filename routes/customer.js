const express = require('express');
const router = express.Router();
//deconstruct route
const {getCustomer, getSingleCustomer, updateCustomer, addCustomer, deleteCustomer} = require('../conrollers/customers')
 const {protect,authorize} = require('../middleware/auth')
//Mount routers
//anything with the same url will be mounted together
router.route('/').get(protect, getCustomer).post(protect,authorize('admin','sAdmin'), addCustomer);

router.route('/:id').get(protect, getSingleCustomer).delete(protect, authorize('admin','sAdmin'), deleteCustomer).put(protect,authorize('admin'), updateCustomer);

module.exports =router;