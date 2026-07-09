module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    }
    req.flash('error', 'Please log in to view that resource');
    res.redirect('/auth/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (req.session && req.session.user) {
      return res.redirect('/dashboard');
    }
    next();
  }
};
