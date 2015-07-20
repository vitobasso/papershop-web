/**
 * Created by Victor on 19/07/2015.
 */
var AspectsFinder = (function() {
    var module = {};

    var api;

    module.init = function () {
        api = new EbayApi();
    };

    module.find = function (category) {
        var categoryFromSet = Categories.get(category);
        if (categoryFromSet.aspects.length == 0) {
            var callback = createHistogramsCallback(categoryFromSet);
            api.histograms({categoryId: category.id}, callback);
        }
    };

    function createHistogramsCallback(category) {
        return function (aspects) {
            rememberAspects(category, aspects);
            FilterUI.populate(aspects)
                .classed("aspect-filter", true);
        };
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
            for (var j = 0, partition; partition = aspect.values[j]; j++) {
                map[partition.name] = aspect;
            }
        }
        return map;
    }

    return module;
}());