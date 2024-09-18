// middlewares/auth.js
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    return next(); // Proceed to the next middleware or route handler
  } else {
    res.redirect('/admin/login'); // Redirect to login if not authenticated
  }
}

module.exports = { ensureAuthenticated };
