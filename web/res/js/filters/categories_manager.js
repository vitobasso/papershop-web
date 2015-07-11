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
        var selRoot = d3.select("#categories");
        selRoot.select("ul").selectAll("li").data(categories, getId)
            .enter()
            .append("li")
            .append("a")
            .attr("href", selCategoryId)
            .html(getName)
            .on("click", fetchAspects);
        selRoot.selectAll("div").data(categories, getId)
            .enter()
            .append("div").attr("id", getCategoryId).classed("filter-div", true)
            .append("ul");

        $("#categories").tabs().tabs("refresh");
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
            populateAspects(category, aspects);
        };
    }

    function rememberAspects(category, aspects) {
        category.aspects = aspects;
        category.aspectValuesMap = mapAspectValues(aspects);
        var values = Object.keys(category.aspectValuesMap);
        category.fuzzyValues = FuzzySet(values);
    }

    function populateAspects(category, aspects) {
        var rootSel = d3.select("#categories")
            .selectAll("div").filter(selCategoryId(category));
        filterUI.populate(rootSel, aspects);
    }

    function selCategoryId(object) {
        return "#" + getCategoryId(object);
    }

    function getCategoryId(object) {
        return "category" + object.id;
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