/**
 * Created by Victor on 18/07/2015.
 */

var ItemCountUI = (function () {
    var module = {};

    var total = 0, filtered = 0;

    module.setTotal = function (newTotal) {
        total = newTotal;
        setText();
    };

    module.setFiltered = function (newFiltered) {
        filtered = newFiltered;
        setText();
    };

    function setText() {
        var text = "Showing " + filtered + " out of " + total + " known items:";
        $("#item-count").text(text);
    }

    return module;
}());