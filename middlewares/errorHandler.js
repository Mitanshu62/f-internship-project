const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR HANDLER] Path: ${req.path}`);
  console.error(`[ERROR HANDLER] Message: ${err.message}`);
  console.error(`[ERROR HANDLER] Stack: ${err.stack}`);

  res.status(err.status || 500);

  // If request accepts JSON (e.g. from an API call), send JSON error
  if (req.accepts('json') && !req.accepts('html')) {
    return res.json({
      success: false,
      error: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Ensure locals are set so header/footer partials don't throw ReferenceErrors
  if (res.locals.user === undefined) res.locals.user = null;
  if (res.locals.error === undefined) res.locals.error = [];
  if (res.locals.success === undefined) res.locals.success = [];

  // Always show the full error stack in the UI for this debugging audit
  res.render('pages/500', {
    title: '500 Internal Server Error',
    error: `Message: ${err.message}\n\nPath: ${req.path}\n\nStack:\n${err.stack}`
  });
};

module.exports = errorHandler;
