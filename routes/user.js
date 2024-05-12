const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require("../controllers/users.js");

router.route('/register')
    // Render user registration form 
    .get(users.renderRegisterForm)
    // Create user 
    .post(catchAsync(users.createUser));

router.route('/login')
    // Render user login form 
    .get(users.renderLoginForm)
    // Login
    .post(storeReturnTo, passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}),users.login)

// Logout
router.get("/logout", users.logout);

module.exports = router;
