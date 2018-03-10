var express = require('express');
var router = express.Router();
var mid = require('../middleware');
var User = require('../models/users');
var Token = require('../models/token');
var Journey = require('../models/journey');
var Station = require('../models/stations');
var Pass = require('../models/pass');
const mongoose = require('mongoose');
const moment = require('moment');
const methodOverride = require("method-override");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcome' });
});

/* GET home page. */
router.get('/bookATicket', function (req, res, next) {
    Station.find({}, function(err, stations){
      res.render('bookATicket', { title: 'Book A Ticket', stations:stations, moment:moment });
    });  
});
router.get('/buyOption', function(req, res, next){
  res.render('buyOption');
});
router.get('/confirmPurchase', function(req, res, next){
  res.render('confirmPuchase');
});
router.get('/buyPass', function(req,res,next){
    res.render('buyPass');
});
router.get('/getcard', function(req,res,next){
  User.findByIdAndUpdate({_id: req.session.userId}, {smartCard: true}, function(err, user){
    User.findById({_id: req.session.userId}, function(err, user){
      res.redirect('profile');
    });
  });
});
router.get('/getBio', function(req,res,next){
  User.findByIdAndUpdate({_id: req.session.userId}, {bioTicket: true}, function(err, user){
    User.findById({_id: req.session.userId}, function(err, user){
      res.redirect('profile');
    });
  });
});
router.get('/journeys', function(req,res,next){
  Journey.find({}, function(err, journeys){
      res.render('journeys', {journeys:journeys, moment:moment})
  });
});
router.post('/buyPass', function(req,res,next){
  var now = moment();
  if(passType = "1 Year") {
    end = now.add(1, 'years');
  } else if ("6 months"){
    end = now.add(6, 'months');
  } else {
    end = now.add(3, 'months');
  }
  var pass = {
    Type : req.body.passType,
    userId: req.session.userId,
    endDate: end
  };
  Pass.create(pass, function(err, pass){
    res.redirect('/');
  });
});

router.post('/bookATicket', function (req, res, next) {
  Journey.find({fromLocation: req.body.from, toLocation: req.body.to}, function(err, journeys){
    Station.find({}, function(err, stations){
      res.render('bookATicket', { title: 'Book A Ticket', journeys:journeys, stations:stations, moment:moment, session: req.session });
    });
    
  });  
});

router.post('/buyTicket', function (req, res, next) {
  User.findById({_id: req.body.userId}, function(err, user){
    Journey.findById({_id: req.body.journeyId}, function(err, journey){
      var balance = parseFloat(user.Balance);
      var amount  = parseFloat(journey.amountPaid);
      var updated = balance - amount;
      if(updated < 0 )
        {
          res.redirect('/profile');
        } else {
          User.findByIdAndUpdate({_id: req.session.userId},{Balance: updated}, function(){
            res.redirect('/confirmPurchase');
          });
        }
    });
  });  
});

/* GET home page. */
router.get('/myTrips', function (req, res, next) {
  res.render('myTrips', { title: 'Your Trips' });
});

/* GET home page. */
router.get('/process', function (req, res, next) {
  
  res.render('process', { title: 'Book A Ticket'});
});

/* GET home page. */
router.post('/confirm', function (req, res, next) {
  User.findById({_id: req.session.userId}, function(err, user){
    var balance = parseFloat(user.Balance);
    var updated = balance + parseFloat(req.body.balance);
    User.findByIdAndUpdate({_id: req.session.userId},{Balance: updated}, function(){
      res.render('confirm', { title: 'Book A Ticket' });
    });
  });
 
  
});

/* GET home page. */
router.get('/guest', function (req, res, next) {
  res.render('guest', { title: 'Guest Home' });
});

/* GET home page. */
router.get('/topUp', function (req, res, next) {
  User.findById({_id: req.session.userId}, 'Balance', function(err, user){
    console.log(user);
    res.render('topUp', { title: 'Guest Home', user:user });
  });  
});


/*Book*/
router.post('/book', function (req, res, next) {
  console.log(req.body.journeyId);
  Journey.findById({_id: req.body.journeyId}, function(err, journey){

    res.render('book', {journey:journey, moment:moment});
  });
});

// GET /login
router.get('/login', mid.loggedOut, function (req, res, next) {
  return res.render('login', { title: 'Log In' });
});

// POST /login
router.post('/login', function (req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        req.session.userName = user.userName;
        req.session.admin = user.admin
        return res.redirect('../profile');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

// GET /logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /profile
router.get('/profile', mid.requiresLogin, function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('profile', { title: 'Profile', name: user.userName, email: user.email, firstName: user.firstName, jobTitle: user.jobTitle });
      }
    });
});


module.exports = router;
