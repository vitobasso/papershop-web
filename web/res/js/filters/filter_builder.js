
var FilterBuilder = (function() {
    var module = {};

    module.init = () => {
        $.subscribe('init', populateFilters);
        $.subscribe('new-filters', populateFilters);
    };

    function populateFilters() {
        if (!Categories.empty()) {
            FilterUI.populate([createCategoryFilter()], "category", ":first-child")
                .selectAll("li")
                .on("click", populateFilters);
        }

        FilterUI.populate(createAspectFilters(), "aspect");
    }

    function createCategoryFilter() {
        var categories = Categories.list();
        return {
            name: "Category",
            values: categories
        };
    }

    function createAspectFilters(){
        var category = pickCategory();
        fetchAspects(category);
        return Categories.getInheritedAspects(category);
    }

    function pickCategory(){
        var result = getFirstSelectedCategory();
        if(!result) result = getBiggestCategory();
        if(!result) result = Sources.get().rootCategory;
        return result;
    }

    function getFirstSelectedCategory(){
        var sel = getSelectedCategories();
        return sel && sel.selected[0]
    }

    function getSelectedCategories(){
        var filter = UIParamsInput.getParams()
                        .filters.find(_ => _.filter.name == "Category");
        return filter && filter.selected;
    }

    function getBiggestCategory(){
        var categoryId = _.chain(Items.list())
            .countBy(item => item.category.id)
            .pairs()
            .max(pair => pair[1])
            .value()[0];
        return Categories.get({id: categoryId});
    }

    function fetchAspects(category){
        if(category == Sources.get().rootCategory) return
        if(!category || category.aspects.length > 0) return
        if(category.hasFetchedFeatures) return // used by websocket only, to avoid an infinite loop when there are no aspects
        AspectsFinder.find(category);
    }

    return module;
}());