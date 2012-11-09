define([
    "jquery"
], function($) {

    var Api = function() {

        var that = {

            getFollowers: function(username, onComplete) {
                $.ajax({
                    url: "followers/",
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