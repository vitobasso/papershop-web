/**
 * Created by Victor on 20/07/2015.
 */
var Items = (function () {
    var module = {};

    var allItems;

    module.init = function () {
        allItems = new Set(getId);
    };

    module.add = function (newItems) {
        allItems.addMergeAll(newItems, merge);
        ItemCountUI.setTotal(allItems.size());
    };

    function merge(oldItem, newItem) {
        for (var key in  newItem.aspects) {
            if (newItem.aspects.hasOwnProperty(key)) {
                oldItem.aspects[key] = newItem.aspects[key];
            }
        }
    }

    module.filter = function () {
        var params = UIParamsInput.getParams();
        var filterFunction = ItemFilter.createFilter(params);
        return allItems.filter(filterFunction);
    };

    module.getByCategory = function (category){
        return allItems.filter(isCategoryEqual(category))
    };

    function isCategoryEqual(category) {
        return function(item) {
            return item.category.id == category.id;
        };
    }

    return module;
}());