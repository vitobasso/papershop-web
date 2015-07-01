/**
 * Created by Victor on 01/07/2015.
 */
function EbayChart() {

    var x = {
        label: "Listing Time",
        scale: d3.time.scale,
        fun: function (d) {
            return d.listingTime;
        }
    };
    var y = {
        label: "Current Price (USD)",
        scale: d3.scale.linear,
        fun: function (d) {
            return d.price;
        }
    };
    var chart = new Chart(x, y);

    var categories = [];
    var items = [];
    var currentPage = 0;

    var ebay = new Ebay();

    this.requestNextPage = function () {
        currentPage = currentPage + 1;
        var keywords = $("input[title=keywords]").val();
        var params = {
            keywords: keywords,
            page: currentPage
        };
        ebay.find(params, populateChart);
    };

    function populateChart(response) {
        var newItems = parseFindResponse(response);
        items = items.concat(newItems);
        categories = uniqueCategories(items);
        populateCategories(categories);
        chart.populate(items);
    }

    function parseFindResponse(response) {
        var items = response.findItemsAdvancedResponse[0].searchResult[0].item || [];
        return items.map(parseItem);
    }

    function parseItem(item) {
        var dateStr = item.listingInfo[0].startTime[0];
        var category = item.primaryCategory[0];
        return {
            id: item.itemId[0],
            category: {
                id: category.categoryId[0],
                name: category.categoryName[0]
            },
            listingTime: dateFormat.parse(dateStr),
            price: +item.sellingStatus[0].currentPrice[0].__value__
        }
    }

    var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");

    function populateCategories(categories) {
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

    function populateAspects(category) {
        ebay.histograms({categoryId: category.id}, function (response) {
            var selCategory = d3.select("#categories")
                .select("[title='" + category.id + "']");

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
                    return partition.name;
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
