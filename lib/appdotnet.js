'use strict';

var qs = require('querystring')
var request = require('request');
var utils = require('./utils');

var APPNET_URL = 'https://alpha-api.app.net/stream/0';

exports.followers = function(req, callback) {
  var user = utils.getUser(req);
  var userId = req.query.user_id || user.id;

  var params = {
    access_token: user.access_token
  };

  request.get(APPNET_URL + '/users/' + userId + '/followers?' + qs.stringify(params),
    function(err, resp, body) {

    if (err) {
      callback(err);
    } else {
      try {
        callback(null, JSON.parse(body));
      } catch(err) {
        callback(err);
      }
    }
  });
};

exports.following = function(req, callback) {
  var user = utils.getUser(req);
  var userId = req.query.user_id || user.id;

  var params = {
    access_token: user.access_token,
    count: req.body.count || null
  };

  request.get(APPNET_URL + '/users/' + userId + '/following?' + qs.stringify(params),
    function(err, resp, body) {

    if (err) {
      callback(err);
    } else {
      try {
        callback(null, JSON.parse(body));
      } catch(err) {
        callback(err);
      }
    }
  });
};