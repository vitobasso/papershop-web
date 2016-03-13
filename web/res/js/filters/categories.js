
var Categories = (function() {
    var module = {};

    var set, root;

    module.init = () => {
        set = new Set(getId);
        root = { aspects: [] };
        $.subscribe('new-items', onNewItems)
        $.subscribe('new-aspects', onNewAspects)
    };

    module.each = fun => set.each(fun);

    module.get = category => set.get(category);

    module.list = () => set.toArray();

    function onNewAspects(_, category, aspects){
        var target = category? set.get(category) : root;
        aspects = setCategory(aspects, category);
        target.aspects.pushAll(aspects);
        populateFilters();
    }

    function setCategory(aspects, category){
        return aspects.map(aspect => {
            aspect.category = idOnly(category);
            return aspect;
        });
    }

    function onNewItems(_, items) {
        var categories = uniqueCategories(items);
        set.addAll(categories);
        populateFilters();
        updateCategory(categories[0])
    }

    function uniqueCategories(items) {
        var mapByCategoryId = d3.map(items, getCategoryId);
        var categoryIds = mapByCategoryId.keys();
        return categoryIds.map(id => {
            var item = mapByCategoryId.get(id);
            return {
                id: item.category.id,
                name: item.category.name,
                parent: root,
                aspects: []
            };
        });
    }

    var getCategoryId = item => item.category.id;

    function populateFilters() {
        if (!set.empty()) {
            var categories = set.toArray();
            var categoriesFilter = {
                name: "Category",
                values: categories
            };

            FilterUI.populate([categoriesFilter])
                .classed("filter", true)
                .classed("category", true)
                .selectAll("li")
                .on("click", updateCategory);
        }

        FilterUI.populate(root.aspects) //TODO inherit aspects and remove this. then populate(getCommonCategory) should be enough
            .classed("filter", true);

        var category = getCommonCategory();
        if(category){
            FilterUI.populate(category.aspects)
                .classed("filter", true);
        }
    }

    function getCommonCategory(){
        //UIParamsInput.getParams() TODO find common ancestor from selected categories
        return set.toArray()[0]
    }

    function updateCategory(category){
        if(category && category.aspects.length == 0){
            AspectsFinder.find(category);
        }
    }

    return module;
}());