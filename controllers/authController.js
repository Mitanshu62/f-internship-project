const User = require('../models/User');

exports.getLogin = (req, res, next) => {
  try {
    console.log(`[TRACE] Rendering pages/login for /auth/login`);
    res.render('pages/login', { title: 'Login - CodeTrack' });
    console.log(`[TRACE] Render complete for pages/login`);
  } catch (error) {
    console.error(`[TRACE] Runtime error in getLogin during render:`, error);
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!req.session) {
      console.error('Runtime error in postLogin: req.session is undefined (database likely disconnected)');
      return res.status(503).render('pages/500', { 
        title: 'Service Unavailable', 
        error: 'Login service is temporarily unavailable. Please try again.' 
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }
    req.session.user = { id: user._id, username: user.username, email: user.email };
    req.flash('success', 'You are now logged in');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Runtime error in postLogin:', error);
    if (req.session && typeof req.flash === 'function') {
      req.flash('error', 'Server error during login');
      res.redirect('/auth/login');
    } else {
      next(error);
    }
  }
};

exports.getSignup = (req, res, next) => {
  try {
    console.log(`[TRACE] Rendering pages/signup for /auth/signup`);
    res.render('pages/signup', { title: 'Signup - CodeTrack' });
    console.log(`[TRACE] Render complete for pages/signup`);
  } catch (error) {
    console.error(`[TRACE] Runtime error in getSignup during render:`, error);
    next(error);
  }
};

exports.postSignup = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  try {
    if (!req.session) {
      console.error('Runtime error in postSignup: req.session is undefined (database likely disconnected)');
      return res.status(503).render('pages/500', { 
        title: 'Service Unavailable', 
        error: 'Signup service is temporarily unavailable. Please try again.' 
      });
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/auth/signup');
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.flash('error', 'Email already exists');
      return res.redirect('/auth/signup');
    }
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      req.flash('error', 'Username already taken');
      return res.redirect('/auth/signup');
    }
    const user = await User.create({ username, email, password });
    req.session.user = { id: user._id, username: user.username, email: user.email };
    req.flash('success', 'Account created successfully!');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Runtime error in postSignup:', error);
    if (req.session && typeof req.flash === 'function') {
      req.flash('error', 'Error creating account. Please try again.');
      res.redirect('/auth/signup');
    } else {
      next(error);
    }
  }
};

exports.logout = (req, res, next) => {
  try {
    if (req.session) {
      req.session.destroy(err => {
        if (err) console.error('Error destroying session:', err);
        res.redirect('/');
      });
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('Runtime error in logout:', error);
    next(error);
  }
};
