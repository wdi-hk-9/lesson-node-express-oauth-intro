var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  google: {
    id:           String,
    access_token: String,
    name:         String,
    email:        String
  }
});



// module.exports = mongoose.model('User',{
//   fb: {
//     id: String,
//     access_token: String,
//     firstName: String,
//     lastName: String,
//     email: String
//   }
// });
