
module.exports = function(app, isLoggedIn) {

    var appdotnet = require('../lib/appdotnet');
    
    app.get('/', function(req, res) {
        res.render('index', 
            { 
                title: "Tree"
            });
    });

    app.get('/graph', function(req, res) {
        if (req.session.passport.user) {
            res.render('graph', 
                { 
                    title: "Tree",
                });
        } else {
            res.redirect("/auth/appdotnet");
        }
    });

    app.get('/user', isLoggedIn, function(req, res) {
        appdotnet.user(req, function(err, result) {
          if (err) {
            res.status(500);
            res.json({ 'error': 'error retrieving user' });
          } else {
            res.json(result);
          }
        });
    });
}
