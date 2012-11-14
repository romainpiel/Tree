'use strict';

var qs = require('querystring')
var request = require('request');
var utils = require('./utils');

var APPNET_URL = 'https://alpha-api.app.net/stream/0';

// chains request
var __request = function(urls, callback) {

        'use strict';

        var results = {},
            t = urls.length,
            c = 0,
            handler = function(error, response, body) {

                var url = response.request.uri.href;

                results[url] = {
                    error: error,
                    response: response,
                    body: body
                };

                if(++c === urls.length) {
                    callback(results);
                }

            };

        while(t--) {
            request(urls[t], handler);
        }
    };

exports.getUser = function(req, callback) {
    var user = utils.getUser(req);
    var userId = req.query.user_id || user.id;

    var params = {
        access_token: user.access_token
    };

    var followersUrl = APPNET_URL + '/users/' + userId + '/followers/ids?' + qs.stringify(params),
        userUrl = APPNET_URL + '/users/' + userId + '?' + qs.stringify(params);

    __request([followersUrl, userUrl], function(responses) {

        var tempBody, tempData, result = {};
        for(var url in responses) {
            if(responses[url].error) {
                callback(responses[url].error);
                return;
            } else {
                try {
                    tempBody = responses[url].response.body;
                    tempData = JSON.parse(tempBody).data;
                    if(url == followersUrl) {
                        result.followers = tempData;
                    } else if(url == userUrl) {
                        result.userid = tempData.id;
                        result.username = tempData.username;
                    }
                } catch(err) {
                    callback(err);
                }
            }
        }

        callback(null, result);
    });
};

exports.getAvatarUrl = function(req) {
    var url = APPNET_URL + '/users/' + req.params.userid + "/avatar";
    return url;
};