/**
 * Created by Victor on 05/07/2015.
 */

function EbayChart(api, getItems, axisSelectorId, colorSelectorId) {

    var categories = new Categories(api);
    var chart;

    this.populate = function (items) {
        categories.populate(items);
        populateSelectors();
        chart.populate(items);
    };

    this.getCategory = function (category) {
        return categories.get(category);
    };

    function rebuildChart() {
        if (chart) {
            chart.destroy();
        }

        var xAxis = getSelected(axisSelectorId);
        var colorAxis = getSelected(colorSelectorId);
        chart = new Chart(priceAxis, xAxis, colorAxis, renderTooltip);

        var items = getItems();
        if (items) {
            chart.populate(items);
        }
    }

    function getSelected(selectorId) {
        var selected = $(selectorId).find("option:selected").get(0)
        return selected.__data__;
    }

    function populateSelectors() {
        populateSelector(axisSelectorId);
        populateSelector(colorSelectorId);
    }

    function populateSelector(selectorId) {
        var selOption = d3.select(selectorId)
            .on("change", rebuildChart)
            .selectAll("option").data(createAxisOptions());
        selOption
            .exit().remove();
        selOption.enter().append("option")
            .html(function (axis) {
                return axis.label;
            });
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
                var aspect = item.aspects[aspectName] || {};
                return aspect.value;
            },
            ifun: function (item) { //TODO index w/ relation to existing data (so legend always has same colors)
                var itemAspect = item.aspects[aspectName] || {};
                return getAspectValueIndex(itemAspect.value, aspectName, item.category);
            }
        }
    }

    function getAspectValueIndex(value, aspectName, referenceCategory) {
        var category = categories.get(referenceCategory);
        var aspectValues = category.aspects.find(byName).values.map(getName);
        return aspectValues.indexOf(value);

        function byName(aspect) {
            return aspect.name == aspectName;
        }
    }

    function renderTooltip() {
        var item = this.__data__;
        var priceStr = item.price.currency + " " + item.price.value;
        return "<div class='chart-tooltip'>" +
            "<img src='" + item.image + "'/>" +
            "<p>" + item.title + "</p>" +
            "<p>" + "Price: " + priceStr + "</p>" +
            "<p>" + "Category: " + item.category.name + "</p>" +
            "<p>" + "Condition: " + item.condition.name + "</p>" +
            renderAspectsForTooltip(item) +
            "</div>";
    }

    function renderAspectsForTooltip(item) {
        var result = "";
        for (var aspectName in item.aspects) {
            if (item.aspects.hasOwnProperty(aspectName)) {
                result += "<p>" + aspectName + ": " + renderAspectValueForTooltip(item.aspects[aspectName]) + "</p>";
            }
        }
        return result;
    }

    function renderAspectValueForTooltip(aspectValue) {
        var result = aspectValue.value;
        if (aspectValue.confidence < 1) {
            result += " (?" + Number(aspectValue.confidence).toFixed(2) + ")";
        }
        return result;
    }

    populateSelectors();
    rebuildChart();

}
