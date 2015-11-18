require('dotenv').load();

var express        = require('express');
var path           = require('path');
var logger         = require('morgan');
var bodyParser     = require('body-parser');
var app            = express();
var mongoose       = require('mongoose');
var passport       = require('passport');
var expressSession = require('express-session');
var cookieParser   = require('cookie-parser');
var expressLayouts = require('express-ejs-layouts');

// Mongoose Setup
mongoose.connect('mongodb://localhost:27017/google-authentication-app');

// Middleware
app.use( cookieParser() );
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);

// Setting up the Passport Strategies
require("./config/passport")(passport);

// Add code here:
app.get('/', function(req, res){
  res.render('layout', {user: req.user});
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('layout', { user: req.user });
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

// app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'} ));

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect: '/',
//     failureRedirect: '/'
//   })
// );

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/")
})

app.listen(3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
