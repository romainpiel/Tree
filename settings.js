'use strict';

// Module dependencies.
module.exports = function(app, configurations, express) {
  var nconf = require('nconf'),
      passport = require('passport'),
      path = require('path');

  var ONE_DAY = 86400000;

  nconf.argv().env().file({ file: 'local.json' });

  // Configuration

  app.configure(function(){

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: nconf.get('session_secret'),
      cookie: { maxAge: 990000000 } // 1 week-ish
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.csrf());
    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname, 'public')));
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

  return app;
};
