requirejs.config({
    paths: {
        jquery: 'lib/jquery-1.8.2.min'    
    }
});


// Load the application.
require(
[
    "jquery",
    "api",
    "graph"
], 
function($, Api, Graph) {

    var api = Api(),
        graph = Graph();

    graph.init();

    $(function() {

        $("#search-btn").on("click", getUser);
        $("#search-input").on("keypress", function(e) {
            if ((e.keyCode || e.which) == 13){
                getUser();
            }
        });

    });

    function getUser() {
        var username = "@" + $("#search-input").val();

        api.getUser(username, function(data) {
            graph.add(data.userid, data.username, data.followers);
        });
    }

});