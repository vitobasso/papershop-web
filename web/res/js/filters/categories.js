
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
        var target = category? set.get(category) : root;
        aspects = setCategory(aspects, target);
        rememberAspects(target, aspects)
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
        fetchAspects(categories[0])
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
            FilterUI.populate([createCategoryFilter()], "category", ":first-child")
                .selectAll("li")
                .on("click", onClickCategory);
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

    function onClickCategory(category) {
        populateFilters();
        fetchAspects(category);
    }

    function fetchAspects(category){
        if(category && category.aspects.length == 0){
            AspectsFinder.find(category);
        }
    }

    function rememberAspects(category, aspects) {
        category.aspects = aspects;
        category.aspectValuesMap = mapAspectValues(aspects);
        var values = Object.keys(category.aspectValuesMap);
        category.fuzzyValues = FuzzySet(values);
    }

    function mapAspectValues(aspects) {
        var map = {};
        for (var i = 0, aspect; aspect = aspects[i]; i++) {
            for (var j = 0, value; value = aspect.values[j]; j++) {
                map[value.name] = aspect;
            }
        }
        return map;
    }

    return module;
}());