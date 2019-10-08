
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
        return "<div class='chart-tooltip'>" +
            "<p>" + item.title + "</p>" +
            "<img src='" + item.image + "'/>" +
            "<p>" + item.price + "</p>" +
            "</div>";
    }

    return module;
}());