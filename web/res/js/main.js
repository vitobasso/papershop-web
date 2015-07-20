/**
 * Created by Victor on 01/07/2015.
 */
var Main = (function () {
    var module = {};

    module.init = function() {
        ListenerAssigner.bindSearchFieldEvents();
    };

    module.applyFilters = function () {
        var items = Items.filter();
        ItemCountUI.setFiltered(items.length);
        ChartManager.setData(items);
    };

    module.updateChart = function(requestParams, newItems) {
        AspectGuesser.guessAspectsFromTitle(newItems);
        rememberAspectsFromRequest(requestParams, newItems);
        Items.add(newItems);
        var items = Items.filter();
        ItemCountUI.setFiltered(items.length);
        ChartManager.onNewItems(items);
    };

    ////////////////////////////////////////////////////////////

    function rememberAspectsFromRequest(requestParams, newItems) {
        var requestAspects = getAspectsFromRequest(requestParams);
        newItems.forEach(function (item) {
            for (var aspectName in requestAspects) {
                if (requestAspects.hasOwnProperty(aspectName)) {
                    item.aspects[aspectName] = {
                        value: requestAspects[aspectName],
                        confidence: 2
                    };
                }
            }
        });
    }

    function getAspectsFromRequest(requestParams) {
        var singleValueAspects = requestParams.aspects.filter(function (aspect) {
            return aspect.values.length == 1;
        });
        var aspectsMap = {};
        singleValueAspects.forEach(function (aspect) {
            aspectsMap[aspect.name] = aspect.values[0];
        });
        return aspectsMap;
    }

    return module;
}());
