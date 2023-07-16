const express = require('express');

//deconstruct route
const {register, login, getMyself,forgotPassword, resetPassword, logout} = require('../conrollers/auth');
const {protect}=require('../middleware/auth')
const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/me',protect, getMyself);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/logout', logout);

module.exports =router;