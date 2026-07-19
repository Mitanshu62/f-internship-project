require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const methodOverride = require('method-override');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('morgan');

const connectDB = require('./config/db');
require('./config/env'); // Perform env validation check at startup

// Connect to Database optimistically on startup
connectDB().catch(err => {
  console.error('Failed to connect to database on startup:', err.message);
});

const app = express();

// Disable x-powered-by header
app.disable('x-powered-by');

// Trust proxy for Render/Vercel deployment
app.set('trust proxy', 1);

// Security and Performance Middleware
app.use(helmet());
app.use(compression());
app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Method override
app.use(methodOverride('_method'));

// Environment and database verification middlewares
const envCheck = require('./middlewares/envCheck');
const dbMiddleware = require('./middlewares/dbMiddleware');
app.use(envCheck);
app.use(dbMiddleware);

// Session store configuration (resilient to missing database variables)
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === 'production' // secure cookies in production (HTTPS)
  }
};

if (process.env.MONGODB_URI) {
  sessionConfig.store = MongoStore.create({ mongoUrl: process.env.MONGODB_URI });
} else {
  console.warn('WARNING: MONGODB_URI is not defined. Sessions will fall back to MemoryStore.');
}

app.use(session(sessionConfig));

// Flash messages
app.use(flash());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static folder with caching for production
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

// Global variables for templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Routes
app.use('/', require('./routes/indexRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/problems', require('./routes/problemRoutes'));
app.use('/goal', require('./routes/goalRoutes'));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

// Global Error Handler
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Conditional port listening
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Global Process Error Handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

module.exports = app;
