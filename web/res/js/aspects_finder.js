/**
 * Created by Victor on 19/07/2015.
 */
function AspectsFinder(categories) {

    this.find = find;

    var api = new EbayApi();
    var filterUI = new FilterUI();

    function find(category) {
        var categoryFromSet = categories.get(category);
        if (categoryFromSet.aspects.length == 0) {
            var callback = createHistogramsCallback(categoryFromSet);
            api.histograms({categoryId: category.id}, callback);
        }
    }

    function createHistogramsCallback(category) {
        return function (aspects) {
            rememberAspects(category, aspects);
            filterUI.populate(aspects)
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

}