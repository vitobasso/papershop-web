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
        var categories = uniqueCategories(newItems);
        $.publish('new-categories', [categories]);
        Items.merge(newItems);
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
            return { //not a reference to this specific item's category object
                id: item.category.id,
                name: item.category.name
            };
        });
    }

    var getCategoryId = item => item.category.id;

    return module;
}());