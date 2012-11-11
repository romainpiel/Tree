requirejs.config({
    paths: {
        jquery: 'lib/jquery-1.8.2.min'    
    }
});

require(
[
    "jquery",
    "utils"
], 
function($, Utils) {

    var utils = Utils();
    if (utils.isTouchDevice()) {
        $(".visible-non-touch").remove();
        $("div.links")
            .prepend($("<p></p>").addClass("text-error").text("Please try it on your desktop."))
            .prepend($("<p></p>").addClass("text-error").text("We are sorry, Tree is not available for touchable devices."));
    }
});
