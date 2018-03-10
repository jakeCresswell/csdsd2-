var express = require('express');
var router = express.Router();
var mid = require('../middleware');
var User = require('../models/users');
const mongoose = require('mongoose');
const methodOverride = require("method-override");

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next) {
    return res.render('register/register', { title: 'Sign Up' });
  });

// POST /register
router.post('/register', function(req, res, next) {
    if (req.body.email &&
      req.body.firstName &&
      req.body.lastName &&
      req.body.userName &&
      req.body.password &&
      req.body.confirmPassword) {

        // confirm that user typed same password twice
        if (req.body.password !== req.body.confirmPassword) {
          var err = new Error('Passwords do not match.');
          err.status = 400;
          return next(err);
        }

        // create object with form input
        var userData = {
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.userName,
          password: req.body.password
        };
        console.log(userData);
        // use schema's `create` method to insert document into Mongo
        User.create(userData, function (error, user) {
          if (error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            return res.redirect('../profile');
          }
        });

      } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
      }
  });

  module.exports = router;