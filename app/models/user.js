// var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

// module.exports = User;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var users = new Schema(
{
  // id: {
  //   type: Number,
  //   required: true,
  //   unique: true
  // },
  username: String,
  password: String,
  timestamps:
  {
    type: Date,
    default: Date.now
  }
});

  users.methods = {};

  users.methods.comparePassword = function( attemptedPassword ,  callback )
  {
    bcrypt.compare( attemptedPassword , this.password , function( err , isMatch )
    {
      callback( isMatch );
    });
  };

  users.methods.hashPassword = function()
  {
    var cipher = Promise.promisify( bcrypt.hash );
    return cipher( this.password , null , null ).bind( this )
      .then( function( hash )
      {
        this.password = hash;
      });
  };

  users.pre( 'save' , function( next )
  {
    users.methods.hashPassword();
    next();
  });

var User = mongoose.model('User', users);

module.exports = User;