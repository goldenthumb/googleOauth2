var express = require('express');
var passport = require('passport');
var router = express.Router();


router.get('/', function(req, res) {
  res.render('index');
});

// USER INFO
router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', {
    user : req.user
  });
});

// LOGOUT
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// google AUTHENTICATE (FIRST LOGIN)
// send to google to do the authentication
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/oauth2callback',
  passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
  })
);


// google AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT)
// send to google to do the authentication
router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

// the callback after google has authorized the user
router.get('/connect/google/callback',
  passport.authorize('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
  })
);

// google UNLINK ACCOUNTS
router.get('/unlink/google', isLoggedIn, function(req, res) {
  var user = req.user;
  user.google.token = undefined;
  user.save(function(err) {
    res.redirect('/profile');
  });
});

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  
  res.redirect('/');
}

module.exports = router;
