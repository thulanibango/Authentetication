const express = require('express');
const router = express.Router();
//deconstruct route
const {getCustomer, getSingleCustomer, updateCustomer, addCustomer, deleteCustomer} = require('../conrollers/customers')

//Mount routers
//anything with the same url will be mounted together
router.route('/').get(getCustomer).post(addCustomer);

router.route('/:id').get(getSingleCustomer).delete(deleteCustomer).put(updateCustomer);

module.exports =router;