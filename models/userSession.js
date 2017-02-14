// load the things we need
var mongoose = require('mongoose');

// define the schema for our userSession model
var userSessionSchema = mongoose.Schema({
  googleId : String,
  googleToken : String,
  googlePhotoPath : String,
  googleEmail : String,
  googleName : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('UserSession', userSessionSchema);
