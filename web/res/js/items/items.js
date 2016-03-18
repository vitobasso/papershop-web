var Items = (function () {
    var module = {};

    var set;

    module.init = () => {
        set = new Set(getId);
        $.subscribe('find-items', onFindItems);
        $.subscribe('new-aspects', onNewAspects)
    };

    function onFindItems(_, requestParams, result) {
        var newItems = result.items;
        AspectGuesser.guessFromTitle(newItems);
        AspectRecaller.rememberFromRequest(requestParams, newItems);
        set.addMergeAll(newItems, merge);
        $.publish('new-items', [newItems, module.filter(), module.list()]);
    }

    function merge(oldItem, newItem) {
        _.keys(newItem.aspects).forEach(function(){
            oldItem.aspects[key] = newItem.aspects[key];
        });
    }

    module.filter = () => {
        var params = UIParamsInput.getParams();
        var filterFunction = ItemFilter.createFilter(params);
        return set.filter(filterFunction);
    };

    module.count = () => set.size();

    module.list = () => set.toArray();

    function onNewAspects(_, category) {
        if (category) { //TODO handle root category and remove if
            var items = getByCategory(category);
            AspectGuesser.guessFromTitle(items);
        }
    }

    function getByCategory(category) {
        return set.filter(isCategoryEqual(category));
    }

    function isCategoryEqual(category) {
        return item => item.category.id == category.id;
    }

    return module;
}());