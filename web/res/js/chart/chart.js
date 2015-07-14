/**
 * Created by Victor on 05/07/2015.
 */

function EbayChart(api) {

    var chartDivId = "#chart";

    var filters = new Filters(),
        categories = new Categories(api),
        axes = new ChartAxes(categories),
        chart = new ScatterPlot(chartDivId),
        tooltip = new ChartTooltip(),
        legend = new ChartLegend(chartDivId, chart),
        items = [];

    var axisOptions, xAxis, colorAxis;

    this.getCategory = function (category) {
        return categories.get(category);
    };

    this.update = function (newItems) {
        filters.populate();
        categories.populate(newItems);
        populateAxisMenu();
        this.setData(newItems);
    };

    this.setData = function (newItems) {
        items = newItems;
        chart.setData(items);
        updateLegendAndTooltips();
    };

    function buildChart() {
        if (items) {
            chart.update(items, axes.priceAxis, xAxis, colorAxis);
            updateLegendAndTooltips();
        }
    }

    function updateLegendAndTooltips() {
        assignTooltips();
        legend.render(items, colorAxis);
    }


    function assignTooltips() {
        $(chartDivId).find("svg").tooltip({
            items: "circle",
            content: tooltip.render
        });
    }

    function populateAxisMenu() {  //TODO x or color
        axisOptions = axes.listOptions();
        $.contextMenu({
            selector: '.x.label',
            trigger: "left",
            callback: changeAxis,
            items: getMenuItems()
        });
    }

    function getMenuItems() {
        return axisOptions.map(getMenuItem);
    }

    function getMenuItem(axis) {
        return {name: axis.label}
    }

    function changeAxis(key) {
        xAxis = axisOptions[key];  //TODO x or color
        buildChart();
    }

    populateAxisMenu();
    xAxis = axisOptions[0];
    colorAxis = axisOptions[0];
    buildChart();

}
