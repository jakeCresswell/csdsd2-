const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JourneySchema = mongoose.Schema.JourneySchema;
const Schema = mongoose.Schema; //creates Schema

//create project scheme and model
//project object defined
const UserSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        required:[true, "Username is required"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        email: true,
        trim: true
    },
    firstName: {
        type: String,
        required:[true, "Name field is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Name field is required"],
        trim: true
    }, Balance: {
      type: Number, 
      default: 0.00
    }, myTrips: {
      type: [JourneySchema]
    }, smartCard: {
      type: Boolean,
      default: false
    }, bioTicket:{
      typ: Boolean,
      default: false
    },
    admin: {
      type: Boolean,
      default: false
    }
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email }) //database query to find if user exists
      .exec(function (error, user) {
        if (error) {
          return callback(error);
        } else if ( !user ) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password , function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
}
// hash password before saving to database
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


const User = mongoose.model('users', UserSchema);

module.exports = User;
