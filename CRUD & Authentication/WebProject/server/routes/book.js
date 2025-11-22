var express = require('express');
var router = express.Router();
var Book = require('../model/book');

function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

// List all books public
router.get('/', function (req, res, next) {
  Book.find().sort({ name: 1 }).exec(function (err, books) {
    if (err) {
      console.log(err);
      return res.render('Books/list', {
        title: 'Book Directory',
        BookList: [],
        error: 'Error loading books',
        displayName: req.user ? req.user.displayName : ''
      });
    }
    res.render('Books/list', {
      title: 'Book Directory',
      BookList: books,
      displayName: req.user ? req.user.displayName : ''
    });
  });
});

// Show Add form securely
router.get('/add', requireAuth, function (req, res, next) {
  res.render('Books/add', {
    title: 'Add Book',
    displayName: req.user ? req.user.displayName : ''
  });
});

// Process Add form
router.post('/add', requireAuth, function (req, res, next) {
  var newBook = new Book({
    name: req.body.name,
    author: req.body.author,
    published: req.body.published,
    description: req.body.description,
    price: req.body.price
  });

  newBook.save(function (err) {
    if (err) {
      console.log(err);
      return res.render('Books/add', {
        title: 'Add Book',
        error: 'Error creating book',
        displayName: req.user ? req.user.displayName : ''
      });
    }
    res.redirect('/books');
  });
});

// Show Edit form
router.get('/edit/:id', requireAuth, function (req, res, next) {
  var id = req.params.id;
  Book.findById(id, function (err, book) {
    if (err || !book) {
      console.log(err);
      return res.redirect('/books');
    }
    res.render('Books/edit', {
      title: 'Edit Book',
      Book: book,
      displayName: req.user ? req.user.displayName : ''
    });
  });
});

// Process Edit form
router.post('/edit/:id', requireAuth, function (req, res, next) {
  var id = req.params.id;
  var updated = {
    name: req.body.name,
    author: req.body.author,
    published: req.body.published,
    description: req.body.description,
    price: req.body.price
  };

  Book.findByIdAndUpdate(id, updated, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/books');
  });
});

// Delete with confirmation in front-end
router.get('/delete/:id', requireAuth, function (req, res, next) {
  var id = req.params.id;
  Book.deleteOne({ _id: id }, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/books');
  });
});

module.exports = router;