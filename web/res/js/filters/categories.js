
var Categories = (function() {
    var module = {};

    var set;

    module.init = () => {
        set = new Set(getId);
        $.subscribe('new-categories', onNewCategories);
        $.subscribe('new-aspects', onNewAspects);
    };

    module.each = fun => set.each(fun);

    module.get = category => set.get(category);

    module.list = () => set.toArray();

    module.empty = () => set.empty();

    function onNewCategories(_, categories) {
        categories.forEach(mergeCategory);
        $.publish('new-filters');
    }

    function onNewAspects(_, category, aspects){
        assert(category);
        var targetCategory = mergeCategory(category);
        targetCategory.aspects = setCategoryToAspects(aspects, targetCategory);
        AspectGuesser.mapValues(targetCategory);
        $.publish('new-filters');
    }

    function mergeCategory(category) {
        set.addMerge(category, mergeObjects);
        var result = set.get(category);
        initCategory(result); //init after merge so the init values doesn't overwrite actual values
        return result;
    }

    function initCategory(category){
        if(!category.aspects) category.aspects = [];
    }

    function setCategoryToAspects(aspects, category){
        return aspects.map(aspect => {
            aspect.category = idOnly(category);
            return aspect;
        });
    }

    return module;
}());