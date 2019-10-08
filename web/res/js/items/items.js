var Items = (function () {
    var module = {};

    var set;

    module.init = () => {
        set = new Set(getId);
        $.subscribe('find-items', mergeNewItems);
        $.subscribe('detailed-item', mergeDetail);
    };

    function mergeNewItems(_, params, result) {
        let newItems = result.items;
        set.addMergeAll(newItems, Merge.mergeObjects);
        $.publish('new-items', [newItems, module.filter(), module.list()]);
    };

    function mergeDetail(_, params, result) {
        result.id = params.item.id;
        result.aspects = {};
        set.addMerge(result, Merge.mergeObjects)
        $.publish('new-items', [[result], module.filter(), module.list()]);
    }

    module.filter = () => {
        var params = UIParamsInput.getParams();
        var filterFunction = ItemFilter.createFilter(params);
        return set.filter(filterFunction);
    };

    module.count = () => set.size();

    module.list = () => set.toArray();

    return module;
}());