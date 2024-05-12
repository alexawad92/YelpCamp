const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require("../controllers/users.js");

// Render user registration form 
router.get("/register", users.renderRegisterForm);

// Create user 
router.post("/register", catchAsync(users.createUser));

// Render user login form 
router.get('/login', users.renderLoginForm);

// Login
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}),users.login);

// Logout
router.get("/logout", users.logout);

module.exports = router;
