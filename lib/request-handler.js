var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })

  Link.find( {} , function( err, link )
  {
    // console.log("link in the fetchLinks = " , link);
    if( err )
    {
      console.log( err );
      res.send(404);
    }
    res.send( 200 , link );
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  // console.log("req.body in the saveLink = " , req.body);
  // console.log("uri in the saveLink = " , uri);

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  // 이미 존재하는 사이트 검색
  Link.find( { url : uri } , function( err , link )
  {
    // console.log("link ------ " , link);
    if( err )
    {
      console.log( err );
    }
    if( link.length > 0 )
    {
      res.send( 200 , link[0] );
    }
    else
    {
      util.getUrlTitle( uri , function( err , title )
      {
        if( err )
        {
          console.log( err );
          return res.send(404);
        }
        var newLink = new Link(
        {
          url : uri,
          title : title,
          baseUrl : req.headers.origin
        });
        // console.log("newLink in the saveLink = " , newLink);
        newLink.save( function( err , newLink )
        {
          res.send( 200 , newLink );
        });
      });
    }
  });
  //console.log("query in request-handler with saveLink = " , query);
  


  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }
  //       var newLink = new Link({
  //         url: uri,
  //         title: title,
  //         baseUrl: req.headers.origin
  //       });
  //       newLink.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });

  User.find( { username: username } , function( err , users )
  {

    // console.log("user in loninUser = " , user);
    // console.log("users in loginUser = " , users[0]);
    if( err )
    {
      res.send( 404 );
    }
    if(!users[0])
    {
      res.redirect( '/login' );
    }
    else if(users[0])
    {
      util.createSession(req, res, users[0]);
      // user.comparePassword( password , function( match )
      // {
      //   if( match )
      //   {
      //     util.createSession( req , res , user );
      //   }
      //   else
      //   {
      //     res.redirect( '/' );
      //   }
      // });
    }
  });


};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });

  User.findOne( { username : username } , function( err , user )
  {
    if( err )
    {
      res.send(404);
    }
    if( !user )
    {
      var newUser = new User(
      {
        username : username,
        password : password
      });
      newUser.save( function( err , newUser )
      {
        if( err )
        {
          res.send(404);
        }
        util.createSession( req , res , newUser );
      });
    }
    else
    {
      // console.log( 'ID already exists' );
      res.redirect( '/signup' );
    }
  });
};

exports.navToLink = function(req, res) {
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });


  Link.find( { code : req.params[ 0 ] } , function( err , links )
  {
    if( err )
    {
      res.send( 404 );
    }
    var link = links[ 0 ];
    // console.log( "link in the navToLink = " , link );
    // console.log( "links in the navToLink = " , links );
    if( !link )
    {
      res.redirect( '/' );
    }
    else
    {
      link.visits++;
      link.save( function( err , link )
      {
        if( err )
        {
          res.send( 404 );
        }
        return res.redirect( link.url );
      });
    }
  });
};