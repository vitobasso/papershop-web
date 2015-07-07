/**
 * Created by Victor on 05/07/2015.
 */

function EbayChart(api, getItems, axisSelectorId) {

    var categories = new Categories(api);
    var chart;

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

    this.populate = function (items) {
        categories.populate(items);
        populateAxisSelector();
        chart.populate(items);
    };

    function populateAxisSelector() {
        var selOption = d3.select(axisSelectorId)
            .on("change", rebuildChart)
            .selectAll("option").data(createAxisOptions());
        selOption
            .exit().remove();
        selOption.enter().append("option")
            .html(function (axis) {
                return axis.label;
            });
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
            "<p>" + "Aspects: " + JSON.stringify(item.aspects) + "</p>" +
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

    function createAxisOptions() {
        var result = [conditionAxis, categoryAxis, listingTimeAxis];
        categories.each(function (category) {
            category.aspects.forEach(function (aspect) {
                result.push(createAspectAxis(aspect.name));
            });
        });
        return result;
    }

    function createAspectAxis(aspectName) {
        return {
            label: aspectName,
            scale: d3.scale.ordinal,
            fun: function (item) {
                return item.aspects[aspectName];
            }
        }
    }

    populateAxisSelector();
    rebuildChart();

}
