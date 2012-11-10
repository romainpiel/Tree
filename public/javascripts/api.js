define([
    "jquery"
], function($) {

    var Api = function() {

        var that = {

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
            }
        }

        return that;
    }

    return Api;
})