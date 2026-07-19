const express = require('express');
const router = express.Router();
const { forwardAuthenticated } = require('../middlewares/auth');
const authController = require('../controllers/authController');

// Debugging middleware for auth routes
router.use((req, res, next) => {
  console.log(`[TRACE] Entering authRoutes for ${req.method} ${req.path}`);
  next();
});

const traceForwardAuth = (req, res, next) => {
  console.log(`[TRACE] Entering forwardAuthenticated middleware`);
  forwardAuthenticated(req, res, (err) => {
    if (err) {
      console.error(`[TRACE] Error in forwardAuthenticated:`, err);
      return next(err);
    }
    console.log(`[TRACE] Leaving forwardAuthenticated middleware`);
    next();
  });
};

// @route   GET /auth/login
router.get('/login', traceForwardAuth, (req, res, next) => {
  console.log(`[TRACE] Entering getLogin controller`);
  authController.getLogin(req, res, next);
});

// @route   POST /auth/login
router.post('/login', traceForwardAuth, authController.postLogin);

// @route   GET /auth/signup
router.get('/signup', traceForwardAuth, (req, res, next) => {
  console.log(`[TRACE] Entering getSignup controller`);
  authController.getSignup(req, res, next);
});

// @route   POST /auth/signup
router.post('/signup', traceForwardAuth, authController.postSignup);

// @route   GET /auth/logout
router.get('/logout', authController.logout);

module.exports = router;
