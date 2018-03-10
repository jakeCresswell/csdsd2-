"use strict"

var express = require('express');
var router = express.Router();
var mid = require('../middleware');
var User = require('../models/users');
var user = require('../models/users');
var users = require('../models/users');
const mongoose = require('mongoose');
const methodOverride = require("method-override");

//----- GET ALL USERS ------//

// GET all users
router.get('/users', mid.requiresLogin, function (req, res, err) {
    User.find(function (err, docs) {
        res.render('users/users', { title: 'Current Users - Client', users: docs });
    });
});

//----- EDIT USER ----//

// GET Edit User profile
router.get('/edituser', mid.requiresLogin,function (req, res, err) {
    User.find(function (err, docs){
        res.render('users/edituser', {title: '|Edit User Profile', users: docs});
    });
  });

  //Edit User PUT
  router.put('/edituser', mid.requiresLogin,function(req, res, next) {
    User.findById(req.session.userId, function(err, User) {
        if (err)
            res.send(err);
        User.firstName = req.body.firstName;  // update the user info
        User.email = req.body.email;
        // save the new user info
        User.save(function(err) {
            if (err)
                res.send(err);
            return res.render('profile', { firstName: User.firstName, email: User.email});
          //  res.json({ message: 'User updated!' });
        });
    });
  });


//---- DELETE USER ACCOUNT ---///

// GET DELETE USER ACCOUNT
router.get('/deleteuser', mid.requiresLogin, function (req, res, err) {
    User.find(function (err, docs) {
        res.render('users/deleteuser', { title: '|Delete User Account', users: docs });
    });
});

//DELETE USER
router.delete('/deleteuser', function (req, res, next) {
    User.findByIdAndRemove(req.session.userId, function (err, User) {
        if (err) {
            res.json(err);
        } else {
            req.session.destroy();
            return res.render('users/successfulDelete', { title: '|Successful Deletion' });
        }
    });
});




module.exports = router;