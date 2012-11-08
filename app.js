
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , passport = require('passport')
  , AppDotNetStrategy = require('passport-appdotnet').Strategy
  , nconf = require('nconf')
  , configurations = module.exports
  , app = express()
  , server = require('http').createServer(app)
  , settings = require('./settings')(app, configurations, express);

nconf.argv().env().file({ file: 'local.json' });

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new AppDotNetStrategy({
    clientID: nconf.get('appnet_consumer_key'),
    clientSecret: nconf.get('appnet_consumer_secret'),
    scope: 'stream messages write_post follow',
    callbackURL: nconf.get('domain') + ':' + nconf.get('port') + '/auth/appdotnet/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function (err) {
      if (!profile.access_token) {
        profile.access_token = accessToken;
      }
      return done(err, profile);
    });
  }
));

var isLoggedIn = function(req, res, next) {
  if (req.session.passport.user) {
    next();
  } else {
    res.redirect('/');
  }
};

require('./routes')(app, isLoggedIn);
require('./routes/auth')(app, passport);

server.listen(nconf.get('port'));