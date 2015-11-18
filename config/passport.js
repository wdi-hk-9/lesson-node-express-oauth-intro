var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log('deserializing user:',user);
      done(err, user);
    });
  });

  passport.use('twitter', new TwitterStrategy({
    consumerKey   : process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL   : "http://127.0.0.1:3000/auth/twitter/callback"
  },function(token, tokenSecret, profile, done) {
    console.log("token : " + token)
    console.log("secret : " + tokenSecret)
    process.nextTick(function() {

      User.findOne({ 'tw.id' : profile.id }, function(err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, user);
        } else {

          var newUser = new User();
          newUser.tw.id           = profile.id;
          newUser.tw.access_token = tokenSecret;
          newUser.tw.firstName    = profile.name.givenName;
          newUser.tw.lastName     = profile.name.familyName;
          newUser.tw.email        = profile.emails[0].value;

          newUser.save(function(err) {
            if (err)
              throw err;
            // after this is saved it will create a variable in the user object
            return done(null, newUser);
          });
        }

      });
    });
  }));

  passport.use('facebook', new FacebookStrategy({
    clientID        : process.env.FACEBOOK_API_KEY,
    clientSecret    : process.env.FACEBOOK_API_SECRET,
    callbackURL     : 'http://localhost:3000/auth/facebook/callback',
    enableProof     : true,
    profileFields   : ['name', 'emails']
  }, function(access_token, refresh_token, profile, done) {

    // // Use this to see the information returned from Facebook
    // console.log(profile)

    process.nextTick(function() {

      User.findOne({ 'fb.id' : profile.id }, function(err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, user);
        } else {

          var newUser = new User();
          newUser.fb.id           = profile.id;
          newUser.fb.access_token = access_token;
          newUser.fb.firstName    = profile.name.givenName;
          newUser.fb.lastName     = profile.name.familyName;
          newUser.fb.email        = profile.emails[0].value;

          newUser.save(function(err) {
            if (err)
              throw err;
            // after this is saved it will create a variable in the user object
            return done(null, newUser);
          });
        }

      });
    });
  }));

}