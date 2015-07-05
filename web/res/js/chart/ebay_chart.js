/**
 * Created by Victor on 05/07/2015.
 */

function EbayChart(getItems, axisSelectorId) {

    var chart;

    function initAxisSelector() {
        d3.select(axisSelectorId)
            .on("change", rebuildChart)
            .selectAll("option").data(xAxisOptions)
            .enter().append("option")
            .html(function (axis) {
                return axis.label;
            });
    }

    function rebuildChart() {
        if (chart) {
            chart.destroy();
        }
        var selected = $(axisSelectorId).find("option:selected").get(0);
        var xAxis = selected.__data__;

        chart = new Chart(xAxis, priceAxis, buildTooltip);
        var items = getItems();
        if (items) {
            chart.populate(items);
        }
    }

    this.populate = function(items) {
        chart.populate(items);
    };

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

    var priceAxis = {
        label: "Current Price (USD)",
        scale: d3.scale.linear,
        fun: function (item) {
            return item.price.value;
        }
    };

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

    var xAxisOptions = [conditionAxis, categoryAxis, listingTimeAxis];

    initAxisSelector();
    rebuildChart();

}
