const mongoose = require('mongoose');
const connectDB = require('../config/db');

module.exports = async (req, res, next) => {
  // Skip DB verification for static files and favicon in case they fall back to Express
  if (req.path.startsWith('/css') || req.path.startsWith('/js') || req.path === '/favicon.ico') {
    return next();
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (error) {
    next(new Error(`Database Connection Error: ${error.message}`));
  }
};
