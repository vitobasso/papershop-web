/**
 * Created by Victor on 01/07/2015.
 */
var Categories = (function() {
    var module = {};

    var set;

    module.init = _ => {
        set = new Set(getId);
    };

    module.each = fun => set.each(fun);

    module.get = category => set.get(category);

    module.list = _ => set.toArray();

    module.populate = items => {
        var categories = uniqueCategories(items);
        set.addAll(categories);
        populateCategories(categories);
    };

    function uniqueCategories(items) {
        var mapByCategoryId = d3.map(items, getCategoryId);
        var categoryIds = mapByCategoryId.keys();
        return categoryIds.map(id => {
            var item = mapByCategoryId.get(id);
            return {
                id: item.category.id,
                name: item.category.name,
                aspects: []
            };
        });
    }

    var getCategoryId = item => item.category.id;

    function populateCategories(categories) {
        var categoryFilter = {
            name: "Category",
            values: categories,
            getValueLabel: getName,
            getValueId: getId
        };

        FilterUI.populate([categoryFilter])
            .classed("common-filter", true)
            .selectAll("li")
            .on("click", AspectsFinder.find);

        AspectsFinder.find(categories[0]);
    }

    return module;
}());