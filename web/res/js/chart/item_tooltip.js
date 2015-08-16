/**
 * Created by Victor on 16/08/2015.
 */
var ItemTooltip = (function () {
    var module = {};

    module.getParams = function () {
        return {
            items: "image",
            track: true,
            content: buildUI
        }
    };

    function buildUI() {
        var item = this.__data__;
        var priceStr = item.price.currency + " " + item.price.value;
        return "<div class='chart-tooltip'>" +
            "<p>" + item.title + "</p>" +
            "<img src='" + item.image + "'/>" +
            "<p>" + priceStr + "</p>" +
            "</div>";
    }

    return module;
}());