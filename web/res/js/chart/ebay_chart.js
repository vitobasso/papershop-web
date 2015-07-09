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
        var axes = createAxisOptions();
        var selOption = d3.select(selectorId)
            .on("change", rebuildChart)
            .selectAll("option").data(axes);
        selOption
            .exit().remove();
        selOption.enter().append("option")
            .html(function (axis) {
                return axis.label;
            });
    }

    function LinearAxis(label, getProperty, getScale) {
        this.label = label;
        this.getProperty = getProperty;
        this.getScale = getScale;
        this.updateDomain = updateLinearDomain(this);
    }

    function OrdinalAxis(label, getProperty) {
        this.label = label;
        this.getProperty = getProperty;
        this.getScale = d3.scale.ordinal;
        this.updateDomain = updateOrdinalDomain(this);
    }

    var priceAxis = new LinearAxis("Current Price (USD)",
        function (item) {
            return item.price.value;
        },
        d3.scale.linear);
    var listingTimeAxis = new LinearAxis("Listing Begin",
        function (item) {
            return item.listingTime;
        },
        d3.time.scale);
    var conditionAxis = new OrdinalAxis("Condition",
        function (item) {
            return item.condition.name;
        });
    var categoryAxis = new OrdinalAxis("Category",
        function (item) {
            return item.category.name;
        });

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
        return new OrdinalAxis(aspectName,
            function (item) {
                var aspect = item.aspects[aspectName] || {};
                return aspect.value;
            })
    }

    function updateLinearDomain(axis) {
        return function (scale, items) {
            var domain = d3.extent(items, axis.getProperty);
            scale.domain(domain).nice();
        }
    }

    function updateOrdinalDomain(axis) {
        return function (scale, items) {
            var domain = getOrdinalDomain(items, axis.getProperty);
            scale.domain(domain);
        }
    }

    function getOrdinalDomain(data, getProperty) {
        var uniqueValues = new Set();
        uniqueValues.addMap(data, getProperty);
        return uniqueValues.toArray().sort(naturalSort);
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
