const env = require('../config/env');

module.exports = (req, res, next) => {
  if (!env.isValid) {
    res.status(500);
    return res.render('pages/500', {
      title: 'Configuration Error',
      error: `Missing Required Environment Variables: ${env.errors.join(', ')}. Please configure them in your Vercel Dashboard.`
    });
  }
  next();
};
