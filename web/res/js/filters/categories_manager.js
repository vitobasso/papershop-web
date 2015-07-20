/**
 * Created by Victor on 01/07/2015.
 */
function Categories() {

    var categoriesSet = new Set(getId);
    var aspectsFinder = new AspectsFinder(this);
    var filterUI = new FilterUI();

    this.populate = function (items) {
        var categoriesArray = uniqueCategories(items);
        categoriesSet.addAll(categoriesArray);
        populateCategories(categoriesArray);
    };

    this.each = function (fun) {
        categoriesSet.each(fun);
    };

    this.get = function(category) {
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

        filterUI.populate([categoryFilter])
            .classed("common-filter", true)
            .selectAll("option")
            .on("click", aspectsFinder.find);

        aspectsFinder.find(categories[0]);
    }

}