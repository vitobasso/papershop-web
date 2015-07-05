/**
 * Created by Victor on 01/07/2015.
 */
function Main() {

    var ebay = new Ebay();
    var categories = new Categories(ebay);

    /////////////////////////////////////////////////////////

    var items = new Set(getId);

    function getId(item) {
        return item.id;
    }

    function addItems(newItems) {
        items.addAll(newItems);
        $("#total-count").show().text(items.size());
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
    var priceAxis = {
        label: "Current Price (USD)",
        scale: d3.scale.linear,
        fun: function (item) {
            return item.price.value;
        }
    };
    var xAxisCandidates = [conditionAxis, categoryAxis, listingTimeAxis];

    var chart;
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
        var xAxis = selected.__data__;
        chart = new Chart(xAxis, priceAxis, buildTooltip);
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

    function populateChart(newItems) {
        addItems(newItems);
        var itemsArray = items.toArray();
        categories.populate(itemsArray);
        chart.populate(itemsArray);
    }

    function buildTooltip() {
        var item = this.__data__;
        var priceStr = item.price.currency + " " + item.price.value;
        return "<div class='chart-tooltip'>" +
            "<img src='" + item.image + "'/>" +
            "<p>" + item.title + "</p>" +
            "<p>" + "Price: " + priceStr + "</p>" +
            "<p>" + "Category: " + item.category.name + "</p>" +
            "<p>" + "Condition: " + item.condition.name + "</p>" +
            "</div>";
    }

/////////////////////////////////////////////////////////

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