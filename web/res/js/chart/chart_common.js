/**
 * Created by Victor on 19/07/2015.
 */
var ChartCommon = (function(){
    var module = {};

    module.findOrdinalDomain = function (data, getProperty) {
        var uniqueValues = new Set();
        uniqueValues.addMap(data, getProperty);
        return uniqueValues.toArray().sort(naturalSort);
    };

    module.replaceUndefined = function (value) {
        return value ? value : "?";
    };

    return module;
}(this));