var Items = (function () {
    var module = {};

    var set;

    module.init = () => {
        set = new Set(getId);
        $.subscribe('find-items', onFindItems);
        $.subscribe('new-aspects', onNewAspects)
    };

    module.add = newItems => {
        set.addMergeAll(newItems, merge);
        $.publish('new-items', [newItems, module.filter(), module.list()]);
    };

    function merge(oldItem, newItem) {
        for (var key in newItem.aspects) {
            if (newItem.aspects.hasOwnProperty(key)) {
                oldItem.aspects[key] = newItem.aspects[key];
            }
        }
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
            AspectGuesser.guessAspectsFromTitle(items);
        }
    }

    function getByCategory(category) {
        return set.filter(isCategoryEqual(category));
    }

    function isCategoryEqual(category) {
        return item => item.category.id == category.id;
    }

    function onFindItems(_, requestParams, result) {
        var newItems = result.items;
        AspectGuesser.guessAspectsFromTitle(newItems);
        rememberAspectsFromRequest(requestParams, newItems);
        Items.add(newItems);
    }

    function rememberAspectsFromRequest(requestParams, newItems) {
        var aspectsMap = getAspectsFromRequest(requestParams);
        newItems.forEach(item => {
            _.keys(aspectsMap).forEach(aspectName => {
                item.aspects[aspectName] = {
                    value: aspectsMap[aspectName],
                    confidence: 2
                }
            })
        });
    }

    function getAspectsFromRequest(requestParams) {
        var singleValueAspects = requestParams.filters.filter(aspect => aspect.selected.length == 1);
        var aspectsMap = {};
        singleValueAspects.forEach(function (aspect) {
            var name = aspect.filter.name;
            aspectsMap[name] = aspect.selected[0].name;
        });
        return aspectsMap;
    }

    return module;
}());