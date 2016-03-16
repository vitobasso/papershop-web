
var AspectsFinder = (function() {
    var module = {};

    module.find = category => {
        var callback = createHistogramsCallback(category);
        Sites.getSelected().findAspects({categoryId: category.id}, callback);
    };

    function createHistogramsCallback(category) {
        return aspects => {
            rememberAspects(category, aspects); //TODO move to categories.js?
            $.publish('new-aspects', [category, aspects]);
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