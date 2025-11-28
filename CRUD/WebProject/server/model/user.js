var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    displayName: {
      type: String,
      trim: true
    },
    // IDs for social logins optional
    googleId: {
      type: String,
      default: null
    },
    githubId: {
      type: String,
      default: null
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'users'
  }
);

// Adds username/password fields and helper methods for local login
userSchema.plugin(passportLocalMongoose);

module.exports.User = mongoose.model('User', userSchema);