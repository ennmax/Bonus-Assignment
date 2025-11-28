// Express app configuration

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var DB = require('./db');
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
var flash = require('connect-flash');

var app = express();

// User model for authentication
var User = require('../model/user').User;

// Connect to MongoDB
mongoose.connect(DB.URI);
var mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'MongoDB Connection Error:'));
mongoDB.once('open', function () {
  console.log('Connected to MongoDB');
});

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  saveUninitialized: false,
  resave: false
}));

// Flash messages
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Google OAuth strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      // Try to find an existing user with this Google ID
      var user = await User.findOne({ googleId: profile.id });

      // If none, create a new user
      if (!user) {
        user = await User.create({
          username: 'google_' + profile.id,
          googleId: profile.id,
          displayName: profile.displayName,
          email:
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : ''
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// GitHub OAuth strategy
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback'
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      // Try to find an existing user with this GitHub ID
      var user = await User.findOne({ githubId: profile.id });

      // If none, create a new user
      if (!user) {
        var email = '';

        if (Array.isArray(profile.emails) && profile.emails.length > 0) {
          email = profile.emails[0].value;
        }

        user = await User.create({
          username: 'github_' + profile.id,
          githubId: profile.id,
          displayName: profile.displayName || profile.username,
          email: email
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Routes
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var booksRouter = require('../routes/book');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

// 404 handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
