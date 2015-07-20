/**
 * Created by Victor on 18/07/2015.
 */

var ItemCountUI = (function () {
    var module = {};

    var total = 0, filtered = 0;

    module.init = function () {
        hide();
    };

    module.setTotal = function (newTotal) {
        total = newTotal;
        show();
    };

    module.setFiltered = function (newFiltered) {
        filtered = newFiltered;
        show();
    };

    function show() {
        var text = "Showing " + filtered + " out of " + total + " known items.";
        $("#item-count").show().text(text);
    }

    function hide() {
        $("#item-count").hide();
    }

    return module;
}());