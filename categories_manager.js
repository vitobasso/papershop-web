/**
 * Created by Victor on 01/07/2015.
 */
function Categories(ebay){

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
        d3.select("#categories")
            .selectAll("li").data(categories)
            .enter()
            .append("li")
            .html(function (category) {
                return category.name;
            })
            .attr("title", function (category) {
                return category.id;
            })
            .on("click", populateAspects)
            .append("ul")
    }

    function populateAspects(category) {
        var selCategory = d3.select("#categories")
            .select("[title='" + category.id + "']");

        ebay.histograms({categoryId: category.id}, function (response) {
            var aspects = parseHistogramsResponse(response);

            var selAspect = selCategory.select("ul")
                .selectAll("li").data(aspects)
                .enter().append("li")
                .html(function (aspect) {
                    return aspect.name;
                });

            var selPartition = selAspect.append("ul")
                .selectAll("li").data(function (aspect) {
                    return aspect.partitions;
                })
                .enter().append("li")
                .html(function (partition) {
                    return partition.name + " (" + partition.count + ")";
                });
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
}