// auth.js - Middleware to ensure user is authenticated
const ensureAuth = (req, res, next) => {
  // Check if the user is logged in by looking for a session variable
  if (!req.session.user) {
    // If not logged in, redirect to the login page
    return res.redirect('/login');
  }
  // If logged in, proceed to the next middleware or route handler
  next();
};

module.exports = ensureAuth;
