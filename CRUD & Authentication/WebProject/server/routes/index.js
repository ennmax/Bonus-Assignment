var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../model/user').User;

function getDisplayName(req) {
  return req.user ? req.user.displayName : '';
}

// Home
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Home',
    displayName: getDisplayName(req)
  });
});

// About
router.get('/about', function (req, res, next) {
  res.render('about', {
    title: 'About',
    displayName: getDisplayName(req)
  });
});

// Contact
router.get('/contact', function (req, res, next) {
  res.render('contact', {
    title: 'Contact',
    displayName: getDisplayName(req)
  });
});

// Login - GET
router.get('/login', function (req, res, next) {
  if (!req.user) {
    res.render('auth/login', {
      title: 'Login',
      message: req.flash('loginMessage'),
      displayName: getDisplayName(req)
    });
  } else {
    res.redirect('/');
  }
});

// Login - POST
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('loginMessage', 'Authentication Error');
      return res.redirect('/login');
    }
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/books');
    });
  })(req, res, next);
});

// Register - GET
router.get('/register', function (req, res, next) {
  if (!req.user) {
    res.render('auth/register', {
      title: 'Register',
      message: req.flash('registerMessage'),
      displayName: getDisplayName(req)
    });
  } else {
    res.redirect('/');
  }
});

// Register - POST
router.post('/register', function (req, res, next) {
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName
  });

  User.register(newUser, req.body.password, function (err) {
    if (err) {
      console.log('Error inserting new user');
      if (err.name === 'UserExistsError') {
        req.flash('registerMessage', 'Registration Error: User already exists');
      }
      return res.render('auth/register', {
        title: 'Register',
        message: req.flash('registerMessage'),
        displayName: getDisplayName(req)
      });
    }

    return passport.authenticate('local')(req, res, function () {
      res.redirect('/books');
    });
  });
});

// Logout
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;