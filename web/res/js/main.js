var Main = (function () {
    var module = {};

    module.init = function () {
        HandlerAssigner.bindSearchFieldEvents();
        Filters.populate();
        $.subscribe('find-items', updateChart);
    };

    module.applyFilters = function () {
        var items = Items.filter();
        $.publish('apply-filter', [items]);
    };

    function updateChart(_, requestParams, result) {
        var newItems = result.items;
        AspectGuesser.guessAspectsFromTitle(newItems);
        rememberAspectsFromRequest(requestParams, newItems);
        Items.add(newItems);
    }

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
            return aspect.selected.length == 1;
        });
        var aspectsMap = {};
        singleValueAspects.forEach(function (aspect) {
            var name = aspect.filter.name;
            aspectsMap[name] = aspect.selected[0].name;
        });
        return aspectsMap;
    }

    return module;
}());
