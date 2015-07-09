/**
 * Created by Victor on 01/07/2015.
 */
function Categories(ebay) {

    var categoriesSet = new Set(getId);

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
            .append("div").attr("id", getCategoryId).classed("category_div", true)
            .append("ul");

        $("#categories").tabs().tabs("refresh");
        fetchAspects(categories[0]);
    }

    function fetchAspects(category) {
        var categoryFromSet = categoriesSet.get(category);
        if (categoryFromSet.aspects.length == 0) {
            ebay.histograms({categoryId: category.id}, function (aspects) {
                categoryFromSet.aspects = aspects;
                categoryFromSet.aspectValuesMap = mapAspectValues(aspects);
                var values = Object.keys(category.aspectValuesMap);
                categoryFromSet.fuzzyValues = FuzzySet(values);
                populateAspects(category, aspects);
            });
        }
    }

    function populateAspects(category, aspects) {
        var selCategory = d3.select("#categories")
            .selectAll("div").filter(selCategoryId(category))
            .select("ul");

        // aspects
        var selAspect = selCategory.selectAll("li").data(aspects, getName)
            .enter().append("li");
        selAspect.append("a")
            .attr("href", "#")
            .html(getName)
            .on("click", toggleActive);

        // aspect values
        selAspect.append("select")
            .attr("multiple", true)
            .attr("size", function (aspect) {
                return aspect.values.length;
            })
            .selectAll("option").data(function (aspect) {
                return aspect.values;
            }, getName)
            .enter()
            .append("option")
            .html(getName);
    }

    function getCategoryId(object) {
        return "category" + object.id;
    }

    function selCategoryId(object) {
        return "#" + getCategoryId(object);
    }

    function toggleActive() {
        $(this).toggleClass("active");
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