/**
 * Created by Victor on 01/07/2015.
 */
function Categories(ebay) {

    var categoriesSet = new Set(getId);
    var filterUI = new FilterUIBuilder();

    this.populate = function (itens) {
        var categoriesArray = uniqueCategories(itens);
        categoriesSet.addAll(categoriesArray);
        populateCategories(categoriesArray);
    };

    this.each = function (fun) {
        categoriesSet.each(fun);
    };

    this.get = function(category) {
        return categoriesSet.get(category);
    };

    function uniqueCategories(items) {
        var mapByCategoryId = d3.map(items, function (item) {
            return item.category.id
        });
        var categoryIds = mapByCategoryId.keys();
        return categoryIds.map(function (id) {
            var item = mapByCategoryId.get(id);
            return {
                id: item.category.id,
                name: item.category.name,
                aspects: []
            };
        });
    }

    function populateCategories(categories) {
        var categoryFilter = {
            name: "Category",
            values: categories,
            getValueLabel: getName,
            getValueId: getId
        };

        filterUI.populate([categoryFilter])
            .classed("common-filter", true)
            .selectAll("option")
            .on("click", fetchAspects);

        fetchAspects(categories[0]);
    }

    function fetchAspects(category) {
        var categoryFromSet = categoriesSet.get(category);
        if (categoryFromSet.aspects.length == 0) {
            var callback = createHistogramsCallback(categoryFromSet);
            ebay.histograms({categoryId: category.id}, callback);
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