const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('pages/login', { title: 'Login - CodeTrack' });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
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
    console.error(error);
    req.flash('error', 'Server error during login');
    res.redirect('/auth/login');
  }
};

exports.getSignup = (req, res) => {
  res.render('pages/signup', { title: 'Signup - CodeTrack' });
};

exports.postSignup = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  try {
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
    console.error(error);
    req.flash('error', 'Error creating account. Please try again.');
    res.redirect('/auth/signup');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Error destroying session:', err);
    res.redirect('/');
  });
};
