var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
  // details from fb acct
  fb: {
    id: String,
    access_token: String,
    firstName: String,
    lastName: String,
    email: String
  }
});