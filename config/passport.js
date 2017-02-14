var passport = require('passport');
var GoogleStrategy   = require('passport-google-oauth2').Strategy;
var UserSession = require('../models/userSession');
var googleAuth = {
  'clientID' : '758547148876-g0veitp1i3ufi0iaqdg5bh6bphabi8hc.apps.googleusercontent.com',
  'clientSecret' : 'uhl_hCi3qymf0nHhHRtequN2',
  'callbackURL' : 'http://localhost:7777/oauth2callback'
}

module.exports = function() {
  
  // passport session setup
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    UserSession.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  passport.use(new GoogleStrategy({
      clientID        : googleAuth.clientID,
      clientSecret    : googleAuth.clientSecret,
      callbackURL     : googleAuth.callbackURL,
      passReqToCallback : true
    },
    function(req, token, refreshToken, profile, done) {
      
      process.nextTick(function() {
        console.log(req.user, token, refreshToken, profile, done);
        
        // check if the user is already logged in
        if (!req.user) {
  
          UserSession.findOne({ googleId : profile.id }, function(err, result) {
            if (err)
              return done(err);
            
            if (result) {
              
              // if there is a user id already but no token
              if (!result.googleToken) {
                result.googleToken = token;
                result.googleName  = profile.displayName;
                result.googlePhotoPath = profile.photos[0].value;
                result.googleEmail = (profile.emails[0].value || '').toLowerCase();
  
                result.save(function(err) {
                  if (err)
                    return done(err);
                  
                  return done(null, result);
                });
              }
              
              return done(null, result);
            } else {
              var newUser = new UserSession();
              
              newUser.googleId = profile.id;
              newUser.googleToken = token;
              newUser.googleName = profile.displayName;
              newUser.googlePhotoPath = profile.photos[0].value;
              newUser.googleEmail = (profile.emails[0].value || '').toLowerCase();
              
              newUser.save(function(err) {
                if (err)
                  return done(err);
                
                return done(null, newUser);
              });
            }
          });
          
        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user;
          
          user.googleId = profile.id;
          user.googleToken = token;
          user.googleName = profile.displayName;
          user.googlePhotoPath = profile.photos[0].value;
          user.googleEmail = (profile.emails[0].value || '').toLowerCase();
          
          user.save(function(err) {
            if (err)
              return done(err);
            
            return done(null, user);
          });
          
        }
        
      });
      
    }));
  
};
