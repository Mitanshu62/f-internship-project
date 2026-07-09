const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/auth');
const pageController = require('../controllers/pageController');

// @route   GET /
// @desc    Landing page
// @access  Public
router.get('/', forwardAuthenticated, pageController.getLandingPage);

// @route   GET /dashboard
// @desc    Dashboard page
// @access  Private
router.get('/dashboard', ensureAuthenticated, pageController.getDashboard);

// @route   GET /profile
// @desc    User profile
// @access  Private
router.get('/profile', ensureAuthenticated, pageController.getProfile);

// @route   GET /statistics
// @desc    User statistics
// @access  Private
router.get('/statistics', ensureAuthenticated, pageController.getStatistics);

module.exports = router;
