/**
 * Created by Victor on 01/07/2015.
 */
var Main = (function () {
    var module = {};

    var allItems;

    module.init = function() {
        allItems = new Set(getId);
        ListenerAssigner.assignSearchFieldListeners();
    };

    function addItems(newItems) {
        allItems.addMergeAll(newItems, mergeItems);
        ItemCountUI.setTotal(allItems.size());
    }

    function mergeItems(oldItem, newItem) {
        for (var key in  newItem.aspects) {
            if (newItem.aspects.hasOwnProperty(key)) {
                oldItem.aspects[key] = newItem.aspects[key];
            }
        }
    }

    /////////////////////////////////////////////////////////

    module.applyFilters = function () {
        var items = filterItems();
        ItemCountUI.setFiltered(items.length);
        ChartManager.setData(items);
    };

    module.updateChart = function(requestParams, newItems) {
        guessAspectsFromTitle(newItems);
        rememberAspectsFromRequest(requestParams, newItems);
        addItems(newItems);
        var items = filterItems();
        ItemCountUI.setFiltered(items.length);
        ChartManager.update(items);
    };

    function filterItems() {
        var params = UIParamsInput.getParams();
        var filterFunction = new ItemFilter(params).filter;
        return allItems.filter(filterFunction);
    }

    ////////////////////////////////////////////////////////////

    function guessAspectsFromTitle(newItems) {
        newItems.forEach(function (item) {
            var category = ChartManager.getCategory(item.category);
            if (category && category.fuzzyValues) {
                guessAspects(item, category);
            }
        });
    }

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
