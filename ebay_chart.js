/**
 * Created by Victor on 01/07/2015.
 */
function EbayChart() {

    var ebay = new Ebay();

    var categories = new Categories(ebay);

    /////////////////////////////////////////////////////////

    var items = new Set(getId);

    function addItems(newItems) {
        items.addAll(newItems);
        $("#total-count").show().text(items.size());
    }

    function getId(item) {
        return item.id;
    }

    /////////////////////////////////////////////////////////

    this.doRequest = function () {
        var params = {
            keywords: $("#keywords").val(),
            listingType: ["AuctionWithBIN", "FixedPrice"],
            aspects: getAspectFilters(),
            page: $("#page").val()

        };
        ebay.find(params, tryPopulateChart);
    };

    function getAspectFilters() {
        var filters = [];
        $("#categories").find("select").each(function (i, aspect) {
            var sel = $(aspect).find("option").filter(":selected");
            if (sel.length > 0) {
                var filter = {
                    name: aspect.__data__.name,
                    values: sel.toArray().map(function (option) {
                        return option.__data__.name
                    })
                };
                filters.push(filter);
            }
        });
        return filters;
    }

    /////////////////////////////////////////////////////////

    var listingTimeAxis = {
        label: "Listing Begin",
        scale: d3.time.scale,
        fun: function (item) {
            return item.listingTime;
        }
    };
    var conditionAxis = {
        label: "Condition",
        scale: d3.scale.ordinal,
        fun: function (item) {
            return item.condition.name;
        }
    };
    var categoryAxis = {
        label: "Category",
        scale: d3.scale.ordinal,
        fun: function (item) {
            return item.category.name;
        }
    };
    var y = {
        label: "Current Price (USD)",
        scale: d3.scale.linear,
        fun: function (item) {
            return item.price.value;
        }
    };
    var chart;

    var xAxisCandidates = [conditionAxis, categoryAxis, listingTimeAxis];

    initAxisSelector();
    rebuildChart();

    function initAxisSelector() {
        d3.select("#x-axis-select")
            .on("change", rebuildChart)
            .selectAll("option").data(xAxisCandidates)
            .enter().append("option")
            .html(function (axis) {
                return axis.label;
            });
    }

    function rebuildChart() {
        if (chart) {
            chart.destroy();
        }
        var selected = $("#x-axis-select").find("option:selected").get(0);
        var x = selected.__data__;
        chart = new Chart(x, y);
        if (!items.empty()) {
            chart.populate(items.toArray());
        }
    }

    function tryPopulateChart(response) {
        try {
            populateChart(response);
        } catch (err) {
            showError(err);
            throw err;
        }
    }

    function populateChart(response) {
        var newItems = parseFindResponse(response);
        addItems(newItems);
        var itemsArray = items.toArray();
        categories.populate(itemsArray);
        chart.populate(itemsArray);
    }

    /////////////////////////////////////////////////////////

    function parseFindResponse(response) {
        var responseItems = response.findItemsAdvancedResponse[0].searchResult[0].item || [];
        return responseItems.map(parseItem);
    }

    function parseItem(item) {
        var dateStr = item.listingInfo[0].startTime[0];
        var category = item.primaryCategory[0];
        var price = item.sellingStatus[0].currentPrice[0];
        return {
            id: item.itemId[0],
            title: item.title[0],
            category: {
                id: category.categoryId[0],
                name: category.categoryName[0]
            },
            condition: parseCondition(item),
            aspects: [],
            listingTime: dateFormat.parse(dateStr),
            price: {
                currency: price["@currencyId"],
                value: +price.__value__
            },
            country: item.country[0],
            image: item.galleryURL[0],
            link: item.viewItemURL[0]
        }
    }

    function parseCondition(item) {
        var result = {};
        if (item.condition && item.condition[0]) {
            var condition = item.condition[0];
            if (condition) {
                result = {
                    id: condition.conditionId[0],
                    name: condition.conditionDisplayName[0]
                }
            }
        }
        return result;
    }

    var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");

///////////////////////////////////////////////////////////

    var condition = [
        {1000: "New"},
        {1500: "New other (see details)"},
        {1750: "New with defects"},
        {2000: "Manufacturer refurbished"},
        {2500: "Seller refurbished"},
        {3000: "Used"},
        {4000: "Very Good"},
        {5000: "Good"},
        {6000: "Acceptable"},
        {7000: "For parts or not working"}
    ];

///////////////////////////////////////////////////////////

    function showError(msg) {
        $("#error-msg").html(msg);
    }

}