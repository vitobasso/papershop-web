var ItemGroomer = (function () {
    var module = {};

    module.init = () => {
        $.subscribe('find-items', onFindItems);
        $.subscribe('new-aspects', onNewAspects)
    };

    function onFindItems(_, requestParams, result) {
        var newItems = result.items;
        AspectGuesser.guessFromTitle(newItems);
        AspectRecaller.rememberFromRequest(requestParams, newItems);
        Items.merge(newItems);
        var categories = uniqueCategories(newItems);
        $.publish('new-categories', [categories]); //FIXME temporally dependant on Items.merge: new-categories -> new-filters -> FilterBuilder.getBiggestCategory() -> Items.list
    }

    function onNewAspects(_, category) {
        if (category) { //TODO handle root category and remove if
            var items = Items.getByCategory(category);
            AspectGuesser.guessFromTitle(items);
        }
    }

    function uniqueCategories(items) {
        var mapByCategoryId = d3.map(items, getCategoryId);
        var categoryIds = mapByCategoryId.keys();
        return categoryIds.map(id => {
            var item = mapByCategoryId.get(id);
            return copyCategory(item.category); //return a new object, not this specific item's property
        });
    }

    function copyCategory(original) {
        return {
            id: original.id,
            name: original.name,
            parent: original.parent
        }
    }

    var getCategoryId = item => item.category.id;

    return module;
}());