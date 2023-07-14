const express = require('express');

//deconstruct route
const {register, login, getMyself} = require('../conrollers/auth');
const {protect, authorize}=require('../middleware/auth')
const router = express.Router();

// router.route('/register').post(register);
router.post('/register',register);
router.post('/login',login);
router.get('/me',protect, getMyself);

module.exports =router;