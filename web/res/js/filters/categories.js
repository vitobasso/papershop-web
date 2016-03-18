
var Categories = (function() {
    var module = {};

    var set, root;

    module.init = () => {
        set = new Set(getId);
        root = { aspects: [] };
        $.subscribe('new-items', onNewItems);
        $.subscribe('new-aspects', onNewAspects);
    };

    module.each = fun => set.each(fun);

    module.get = category => set.get(category);

    module.list = () => set.toArray();

    function onNewAspects(_, category, aspects){
        var targetCategory = attachCategory(category);
        targetCategory.aspects = setCategoryToAspects(aspects, targetCategory);
        AspectGuesser.mapValues(targetCategory);
        populateFilters();
    }

    function attachCategory(category) {
        if (category) {
            var oldCategory = set.get(category);
            if (oldCategory) {
                return oldCategory;
            } else {
                set.add(fillNewCategory(category));
                return category;
            }
        } else {
            return root;
        }
    }

    function fillNewCategory(category){
        if(!category.parent) category.parent = root;
        if(!category.aspects) category.aspects = [];
        return category;
    }

    function setCategoryToAspects(aspects, category){
        return aspects.map(aspect => {
            aspect.category = idOnly(category);
            return aspect;
        });
    }

    function onNewItems(_, items) {
        var categories = uniqueCategories(items);
        set.addAll(categories);
        populateFilters();
    }

    function uniqueCategories(items) {
        var mapByCategoryId = d3.map(items, getCategoryId);
        var categoryIds = mapByCategoryId.keys();
        return categoryIds.map(id => {
            var item = mapByCategoryId.get(id);
            return fillNewCategory({
                id: item.category.id,
                name: item.category.name
            });
        });
    }

    var getCategoryId = item => item.category.id;

    function populateFilters() {
        if (!set.empty()) {
            FilterUI.populate([createCategoryFilter()], "category", ":first-child")
                .selectAll("li")
                .on("click", populateFilters);
        }

        FilterUI.populate(createAspectFilters(), "aspect");
    }

    function createCategoryFilter() {
        var categories = set.toArray();
        return {
            name: "Category",
            values: categories
        };
    }

    function createAspectFilters(){
        var category = pickCategory();
        fetchAspects(category);
        return getInheritedAspects(category);
    }

    function pickCategory(){
        var result = getSelectedCategory();
        if(!result) result = getBiggestCategory();
        if(!result) result = root;
        return result;
    }

    function getSelectedCategory(){
        var filter = UIParamsInput.getParams()
            .filters.find(_ => _.filter.name == "Category");
        if(filter){
            return filter.selected[0]; //TODO multiple selection?
        }
    }

    function getBiggestCategory(){
        var categoryId = _.chain(Items.list())
            .countBy(item => item.category.id)
            .pairs()
            .max(pair => pair[1])
            .value()[0];
        return set.get({id: categoryId});
    }

    function getInheritedAspects(category) {
        var result = [];
        do {
            result = category.aspects.concat(result);
            category = category.parent;
        } while (category);
        return result;
    }

    function fetchAspects(category){
        if(category && category.aspects.length == 0){
            AspectsFinder.find(category);
        }
    }


    return module;
}());