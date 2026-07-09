const express = require('express');
const router = express.Router();
const { forwardAuthenticated } = require('../middlewares/auth');
const authController = require('../controllers/authController');

// @route   GET /auth/login
// @desc    Login page
// @access  Public
router.get('/login', forwardAuthenticated, authController.getLogin);

// @route   POST /auth/login
// @desc    Login handler
// @access  Public
router.post('/login', forwardAuthenticated, authController.postLogin);

// @route   GET /auth/signup
// @desc    Signup page
// @access  Public
router.get('/signup', forwardAuthenticated, authController.getSignup);

// @route   POST /auth/signup
// @desc    Signup handler
// @access  Public
router.post('/signup', forwardAuthenticated, authController.postSignup);

// @route   GET /auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', authController.logout);

module.exports = router;
