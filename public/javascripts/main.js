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

        $("#search-btn").on("click", function() {

            var username = "@" + $("#search-input").val();

            api.getFollowers(username, function(data) {
                graph.add(username, data.users);
            });
        });

    });


});