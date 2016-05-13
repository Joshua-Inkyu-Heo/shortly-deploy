// Bookshelf version
// Bookshelf version

// var path = require('path');
// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// module.exports = db;

var mongoose = require('mongoose');
//var dbUrl = 'mongodb://admin:admin@ds053295.mongolab.com:53295/human';
var mongoURL = process.env.URL || 'mongodb://localhost/shortly-deploy';

var db = mongoose.connect( mongoURL );

// 컨트롤 + C를 누르면 몽구스 연결 종료
// process.on('SIGINT', function() {
//   mongoose.connection.close(function () {
//     console.log('Mongoose default connection disconnected');
//     process.exit(0);
//   });
// });

// require('./models/link.js');
// require('./models/user.js');

//var db = require('bookshelf')(knex);
module.exports = db;
