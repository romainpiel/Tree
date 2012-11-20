define([
    "jquery"
], function($) {

    var Api = function() {}

    // Api should only be accessed in a static way
    Api = $.extend({}, Api, {

        getUser: function(username, onComplete) {
            $.ajax({
                url: "user/",
                type: 'GET',
                data: {
                    user_id: username
                },
                dataType: 'json',
                cache: false

            }).done(onComplete);
        },

        getAvatar: function(username) {
            return "user/avatar/"+username;
        }
    });

    return Api;
})