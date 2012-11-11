define(function() {

    var Utils = function() {

        var that = {
            isTouchDevice: function() {
                return !!('ontouchstart' in window);
            }
        }

        return that;
    }

    return Utils;
});