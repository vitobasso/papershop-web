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
            addFilterProperties(aspects);
            rememberAspects(category, aspects);
            ChartManager.updateAxisOptions();
            guessAspectsForOldItems(category);
            FilterUI.populate(aspects)
                .classed("aspect-filter", true);
        };
    }

    function addFilterProperties(aspects) {
        aspects.forEach(function(aspect) {
            aspect["getValueLabel"] = identity;
            aspect["getValueId"] = identity;
        });
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
                map[value] = aspect;
            }
        }
        return map;
    }

    function guessAspectsForOldItems(category) {
        var items = Items.getByCategory(category);
        AspectGuesser.guessAspectsFromTitle(items);
    }

    return module;
}());