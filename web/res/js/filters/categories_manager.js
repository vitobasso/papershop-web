/**
 * Created by Victor on 01/07/2015.
 */
var Categories = (function() {
    var module = {};

    var categoriesSet;

    module.init = function() {
        categoriesSet = new Set(getId);
    };

    module.populate = function (items) {
        var categoriesArray = uniqueCategories(items);
        categoriesSet.addAll(categoriesArray);
        populateCategories(categoriesArray);
    };

    module.each = function (fun) {
        categoriesSet.each(fun);
    };

    module.get = function(category) {
        return categoriesSet.get(category);
    };

    function uniqueCategories(items) {
        var mapByCategoryId = d3.map(items, function (item) {
            return item.category.id
        });
        var categoryIds = mapByCategoryId.keys();
        return categoryIds.map(function (id) {
            var item = mapByCategoryId.get(id);
            return {
                id: item.category.id,
                name: item.category.name,
                aspects: []
            };
        });
    }

    function populateCategories(categories) {
        var categoryFilter = {
            name: "Category",
            values: categories,
            getValueLabel: getName,
            getValueId: getId
        };

        FilterUI.populate([categoryFilter])
            .classed("common-filter", true)
            .selectAll("option")
            .on("click", AspectsFinder.find);

        AspectsFinder.find(categories[0]);
    }

    return module;
}());