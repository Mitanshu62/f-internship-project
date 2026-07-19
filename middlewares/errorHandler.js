const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500);

  // If request accepts JSON (e.g. from an API call), send JSON error
  if (req.accepts('json') && !req.accepts('html')) {
    return res.json({
      success: false,
      error: err.message || 'Server Error'
    });
  }

  // Ensure locals are set so header/footer partials don't throw ReferenceErrors
  if (res.locals.user === undefined) res.locals.user = null;
  if (res.locals.error === undefined) res.locals.error = [];
  if (res.locals.success === undefined) res.locals.success = [];

  // Otherwise render the 500 error page
  res.render('pages/500', {
    title: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on our end.'
  });
};

module.exports = errorHandler;
