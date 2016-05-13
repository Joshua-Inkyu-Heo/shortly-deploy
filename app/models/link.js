// var db = require('../config');
var crypto = require('crypto');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var url = new Schema(
{
  // id: {
  //   type: Number,
  //   required: true,
  //   unique: true
  // },
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits:
  {
    type: Number,
    default: 0
  },
  timestamps:
  {
    type: Date,
    default: Date.now
  }
});

url.pre( 'save' , function( next )
{
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

var Link = mongoose.model( 'Link' , url );

module.exports = Link;