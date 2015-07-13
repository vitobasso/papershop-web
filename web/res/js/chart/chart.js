/**
 * Created by Victor on 05/07/2015.
 */

function EbayChart(api, axisSelectorId, colorSelectorId) {

    var filters = new Filters();
    var categories = new Categories(api);
    var axes = new ChartAxes(categories);
    var tooltip = new ChartTooltip();
    var chart = new Chart("#chart", tooltip.render);
    var items = [];

    this.getCategory = function (category) {
        return categories.get(category);
    };

    this.update = function (newItems) {
        filters.populate();
        categories.populate(newItems);
        populateSelectors();
        this.repopulate(newItems);
    };

    this.repopulate = function (newItems) {
        items = newItems;
        chart.setData(items);
    };

    function getSelected(selectorId) {
        var selected = $(selectorId).find("option:selected").get(0);
        return selected.__data__;
    }

    function populateSelectors() {
        populateSelector(axisSelectorId);
        populateSelector(colorSelectorId);
    }

    function populateSelector(selectorId) {
        var selOption = d3.select(selectorId)
            .on("change", rebuild)
            .selectAll("option").data(axes.listOptions());
        selOption
            .exit().remove();
        selOption.enter().append("option")
            .html(function (axis) {
                return axis.label;
            });
    }

    function rebuild() {
        var xAxis = getSelected(axisSelectorId);
        var colorAxis = getSelected(colorSelectorId);

        if (items) {
            chart.update(items, axes.priceAxis, xAxis, colorAxis);
        }
    }

    populateSelectors();
    rebuild();

}
