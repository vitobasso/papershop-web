/**
 * Created by Victor on 20/07/2015.
 */
var Items = (function () {
    var module = {};

    var set;

    module.init = _ => {
        set = new Set(getId);
    };

    module.add = newItems => {
        set.addMergeAll(newItems, merge);
        MessageUI.setTotal(set.size());
    };

    function merge(oldItem, newItem) {
        for (var key in newItem.aspects) {
            if (newItem.aspects.hasOwnProperty(key)) {
                oldItem.aspects[key] = newItem.aspects[key];
            }
        }
    }

    module.filter = _ => {
        var params = UIParamsInput.getParams();
        var filterFunction = ItemFilter.createFilter(params);
        return set.filter(filterFunction);
    };

    module.getByCategory = (category) => set.filter(isCategoryEqual(category))

    module.count = _ => set.size();

    module.list = _ => set.toArray();

    function isCategoryEqual(category) {
        return function(item) {
            return item.category.id == category.id;
        };
    }

    return module;
}());