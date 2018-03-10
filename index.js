const express = require('express');
const path = require('path');
//setup express app
const bodyParser = require('body-parser'); //above for need before
const validator = require('express-validator'); //validation
const logger = require('morgan'); //store
const cookieParser = require('cookie-parser'); //cookie
const mongoose = require('mongoose'); //support framework for Mongoose connection
const session = require('express-session'); //sessioning and persistence
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const morgan = require('morgan');
const moment = require('moment');
const app = express(); //application name

// ------- Route Declarations for Controllers -------- //
const routes = require('./controllers/index'); //routes controller
const userRoutes = require('./controllers/users');
const registerRoute = require('./controllers/register');

// ---------- Connect to MongoDB ------------- //
mongoose.connect('mongodb://localhost/transportdb')
let db = mongoose.connection;  // check the MONGO DB connection is successful
mongoose.Promise = global.Promise; //overriding deprication
db.once('open', function(){
  console.log('Connected to Mongo DB');
});

// ------------- Use Sessions for Tracking Logins ------------------ //
app.use(session({
  secret: 'WeLoveCaseStudiesYeswEdO',
  resave: true,
  saveUninitialized: false
}));

// ------ Make UserID available in templates full access to views ------- //
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

// ---------- load view engine ------------ //
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('view options', {layout: false});

// ------ logger ---------- //
app.use(logger('dev')); // log http
// ------ middleware for body requests ----- //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// ------ method overide for PUT DELETE ------ //
app.use(methodOverride('_method'));
// ------- middleware for static files -------- //
app.use(express.static(path.join(__dirname, '/public')));



app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});
// ------  controller initialization ------- //
app.use('/', routes); // index get routes
app.use('/users', userRoutes); //users controller
app.use('/register', registerRoute); // register controller


// ------- error handling middleware -------- //
app.use(function(err, req, res, next){
    //console.log(err)
    res.status(422).send({error: err.message});
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});
// error handler
// ----- define as the last app.use callback ----- //
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// ------- listen for requests ------- //
app.listen(process.env.port || 3000, function(){
    console.log("now listening for requests...");
});
