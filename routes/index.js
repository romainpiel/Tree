
module.exports = function(app, isLoggedIn) {

    var appdotnet = require('../lib/appdotnet');
    
    app.get('/', function(req, res) {
        res.render('index', 
            { 
                title: "Tree",
                session: req.session.passport.user? req.session.passport : false
            });
    });

    app.get('/followers', isLoggedIn, function(req, res) {
        appdotnet.user(req, function(err, result) {
          if (err) {
            res.status(500);
            res.json({ 'error': 'error retrieving followers' });
          } else {
            res.json(result);
          }
        });
    });
}
