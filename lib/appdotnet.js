'use strict';

var qs = require('querystring')
var request = require('request');
var utils = require('./utils');

var APPNET_URL = 'https://alpha-api.app.net/stream/0';

// chains request
var __request = function (urls, callback) {

    'use strict';

    var results = {}, t = urls.length, c = 0,
        handler = function (error, response, body) {

            var url = response.request.uri.href;

            results[url] = { error: error, response: response, body: body };

            if (++c === urls.length) { callback(results); }

        };

    while (t--) { request(urls[t], handler); }
};

exports.user = function(req, callback) {
    var user = utils.getUser(req);
    var userId = req.query.user_id || user.id;

    var params = {
        access_token: user.access_token
    };

    var followersUrl = APPNET_URL + '/users/' + userId + '/followers/ids?' + qs.stringify(params),
        userUrl = APPNET_URL + '/users/' + userId + '?' + qs.stringify(params);

    __request([followersUrl,userUrl], function(responses) {

        var tempBody,
            result = {};
        for (var url in responses) {
            if(responses[url].error) {
                callback(responses[url].error);
                return;
            } else {
                try {
                    tempBody = responses[url].response.body;
                    if (url == followersUrl) {
                        result.followers = JSON.parse(tempBody).data;
                    } else if (url == userUrl) {
                        result.userid = JSON.parse(tempBody).data.id;
                    }
                } catch(err) {
                    callback(err);
                }
            }
        }

        callback(null, result);
    });
};