/**
 * Created by Victor on 01/07/2015.
 */
function Categories(ebay) {

    var categories = [];

    this.addFromItens = function (itens) {
        categories = uniqueCategories(itens);
        populate();
    };

    function uniqueCategories(items) {
        var mapByCategoryId = d3.map(items, function (item) {
            return item.category.id
        });
        var categoryIds = mapByCategoryId.keys();
        return categoryIds.map(function (id) {
            var item = mapByCategoryId.get(id);
            return item.category;
        });
    }

    function populate() {
        var selRoot = d3.select("#categories");
        selRoot.select("ul").selectAll("li").data(categories, getId)
            .enter()
            .append("li")
            .append("a")
            .attr("href", selCategoryId)
            .html(getName)
            .on("click", populateAspects);
        selRoot.selectAll("div").data(categories, getId)
            .enter()
            .append("div").attr("id", getCategoryId).classed("category_div", true)
            .append("ul");

        $("#categories").tabs().tabs("refresh");
    }

    function populateAspects(category) {
        var selCategory = d3.select("#categories")
            .selectAll("div").filter(selCategoryId(category))
            .select("ul");

        ebay.histograms({categoryId: category.id}, function (response) {
            var aspects = parseHistogramsResponse(response);

            // populate aspects
            var selAspect = selCategory.selectAll("li").data(aspects, getName)
                .enter().append("li");
            selAspect.append("a").attr("href", "#").html(getName)
                .on("click", toggleActive);

            // populate partitions
            selAspect.append("ul")
                .selectAll("li").data(function (aspect) {
                    return aspect.partitions;
                }, getName)
                .enter().append("li").append("a").attr("href", "#").html(getName)
                .on("click", toggleActive);
        });
    }

    function parseHistogramsResponse(response) {
        var aspects = response.getHistogramsResponse[0].aspectHistogramContainer[0].aspect;
        return aspects.map(function (aspect) {
            return {
                name: aspect['@name'],
                partitions: aspect.valueHistogram.map(function (histogram) {
                    return {
                        name: histogram['@valueName'],
                        count: histogram.count[0]
                    }
                })
            }
        });
    }

    function getId(object) {
        return object.id;
    }

    function getName(object) {
        return object.name;
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
}