/**
 * Created by Victor on 01/07/2015.
 */
function Categories(ebay) {

    var categories = [];

    this.populate = function (itens) {
        categories = uniqueCategories(itens);
        populateCategories();
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

    function populateCategories() {
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
        populateAspects(categories[0]);
    }

    function populateAspects(category) {
        var selCategory = d3.select("#categories")
            .selectAll("div").filter(selCategoryId(category))
            .select("ul");

        ebay.histograms({categoryId: category.id}, function (aspects) {

            // populate aspects
            var selAspect = selCategory.selectAll("li").data(aspects, getName)
                .enter().append("li");
            selAspect.append("a")
                .attr("href", "#")
                .html(getName)
                .on("click", toggleActive);

            // populate partitions
            selAspect.append("select")
                .attr("multiple", true)
                .attr("size", function(aspect){
                    return aspect.partitions.length;
                })
                .selectAll("option").data(function (aspect) {
                    return aspect.partitions;
                }, getName)
                .enter()
                .append("option")
                .html(getName);
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