
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

    function onNewAspects(_, category, aspects){ //TODO should new-aspects be replaced by new-categories?
        assert(category);
        var targetCategory = mergeCategory(category);
        var newAspects = setCategoryToAspects(aspects, targetCategory); //FIXME aspects were already on category that was just merged (at least when comming from item_finder)
        Merge.mergeArrays(targetCategory.aspects, newAspects, getId);
        AspectGuesser.mapValues(targetCategory);
        $.publish('new-filters');
    }

    function mergeCategory(category) {
        set.addMerge(category, Merge.mergeObjects);
        var result = set.get(category);
        initCategory(result); //init after merge so the init values doesn't overwrite actual values //TODO sohuldn't be needed with deep merge
        return result;
    }

    function initCategory(category){
        if(!category.aspects) category.aspects = [];
    }

    module.getInheritedAspects = function(category) {
        var result = [];
        do {
            result = category.aspects.concat(result);
            category = category.parent;
        } while (category);
        return result;
    };

    function setCategoryToAspects(aspects, category){
        return aspects.map(aspect => {
            aspect.category = idOnly(category);
            return aspect;
        });
    }

    return module;
}());