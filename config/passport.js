var User              = require('../models/user');
var FacebookStrategy  = require('passport-facebook').Strategy;
var TwitterStrategy   = require('passport-twitter').Strategy;
var GoogleStrategy    = require('passport-google-oauth').OAuthStrategy;

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

  //TWITTER
  passport.use('twitter', new TwitterStrategy({
    consumerKey       : process.env.TWITTER_API_KEY,
    consumerSecret   : process.env.TWITTER_API_SECRET,
    callbackURL    : 'http://localhost:3000/auth/twitter/callback'
  },
    function(token, tokenSecret, profile, done) {
      process.nextTick(function() {

      User.findOne({ 'tw.id': profile.id }, function(err, user) {
        if (err) {
          return done(err);
        } if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.tw.id           = profile.id;
          newUser.tw.access_token = tokenSecret;

          newUser.save(function(err) {
            if (err) {
              throw err;
            } else {
              return done(null, newUser);
            }
          });
        }

      });
    });
  }));

  //FACEBOOK
  passport.use('facebook', new FacebookStrategy({
    clientID        : process.env.FACEBOOK_API_KEY,
    clientSecret    : process.env.FACEBOOK_API_SECRET,
    callbackURL     : 'http://localhost:3000/auth/facebook/callback',
    enableProof     : true,
    profileFields   : ['name', 'emails']
  },
    function(access_token, refresh_token, profile, done) {
      process.nextTick(function() {
    // // Use this to see the information returned from Facebook
    // console.log(profile)
      User.findOne({ 'fb.id' : profile.id }, function (err, user) {
        if (err) {
          return done(err);
        } if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.fb.id           = profile.id;
          newUser.fb.access_token = access_token;
          newUser.fb.firstName    = profile.name.givenName;
          newUser.fb.lastName     = profile.name.familyName;
          newUser.fb.email        = profile.emails[0].value;

          newUser.save(function(err) {
            if (err) {
              throw err;
            } else {
            return done(null, newUser);
            }
          });
        }

      });
    });
  }));

  //GOOGLE
  passport.use('google', new GoogleStrategy({
      consumerKey     : process.env.GOOGLE_API_KEY,
      consumerSecret  : process.env.GOOGLE_API_SECRET,
      callbackURL     : "http://localhost:3000/auth/google/callback"
    },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
  ));

}
