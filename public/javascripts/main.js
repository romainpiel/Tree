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

    var userListEl,
        searchInputEl;

    $(function() {

        // init dom elements
        userListEl = $("#user-list");
        searchInputEl = $("#search-input");

        // init graph
        graph.init();

        // init events
        $("#search-btn").on("click", getUser);
        
        searchInputEl.on("keypress", function(e) {
            if ((e.keyCode || e.which) == 13){
                getUser();
            }
        });

        userListEl.find("li a.delete").live("click", function() {
            deleteUser($(this).closest("li"));
        });

    });

    function getUser() {
        var username = "@" + $("#search-input").val();
        api.getUser(username, addUser);
    }

    function addUser(data) {
        graph.add(data.userid, data.username, data.followers);
        
        userListEl.append(
            ($("<li></li>").attr("data-user-id", data.userid))
                .append($("<a class='delete'>&times;</a>"))
                .append($("<span></span>").text("@" + data.username))
        );

        searchInputEl.val("");
    }

    function deleteUser(li) {
        li.remove();
        graph.deleteNode(li.attr("data-user-id"));
    }

});