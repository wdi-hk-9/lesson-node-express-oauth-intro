var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;



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

  passport.use('google', new GoogleStrategy({
    consumerKey   : process.env.GOOGLE_API_KEY,
    consumerSecret: process.env.GOOGLE_API_SECRET,
    callbackURL   : "http://127.0.0.1:3000/auth/google/callbacK"
  },function(token, tokenSecret, profile, done) {

    process.nextTick(function() {

      User.findOne({ 'gg.id' : profile.id }, function(err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, user);
        } else {

          var newUser             = new User();
          newUser.gg.id           = profile.id;
          newUser.gg.access_token = token;
          newUser.gg.firstName    = profile.name.displayName;
          newUser.gg.email        = profile.email;

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }

      });
    });
  }));

  passport.use('twitter', new TwitterStrategy({
    consumerKey   : process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL   : "http://127.0.0.1:3000/twitter/callback"
  },function(token, tokenSecret, profile, done) {

    process.nextTick(function() {

      User.findOne({ 'tw.id' : profile.id }, function(err, user) {
        if (err) return done(err);
        if (user) {
          return done(null, user);
        } else {

          var newUser             = new User();
          newUser.tw.id           = profile.id;
          newUser.tw.access_token = token;
          newUser.tw.firstName    = profile.name.displayName;
          newUser.tw.email        = profile.email;

          newUser.save(function(err) {
            if (err)
              throw err;
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