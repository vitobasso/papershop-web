/**
 * Created by Victor on 05/07/2015.
 */

function EbayChart(api, getItems, axisSelectorId, colorSelectorId) {

    var categories = new Categories(api);
    var axes = new ChartAxes(categories);
    var tooltip = new ChartTooltip();
    var chart = new Chart(tooltip.render);

    this.getCategory = function (category) {
        return categories.get(category);
    };

    this.populate = function (items) {
        categories.populate(items);
        populateSelectors();
        chart.populate(items);
    };

    function rebuildChart() {
        var xAxis = getSelected(axisSelectorId);
        var colorAxis = getSelected(colorSelectorId);

        var items = getItems();
        if (items) {
            chart.change(items, axes.priceAxis, xAxis, colorAxis);
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
            .selectAll("option").data(axes.listOptions());
        selOption
            .exit().remove();
        selOption.enter().append("option")
            .html(function (axis) {
                return axis.label;
            });
    }


    populateSelectors();
    rebuildChart();

}
