/**
 * Created by Victor on 05/07/2015.
 */

function EbayChart(api) {

    var filters = new Filters(),
        categories = new Categories(api),
        axes = new AxisFactory(categories),
        renderer = new ChartRenderer(),
        items = [];

    var axisOptions, xAxis, colorAxis;

    this.getCategory = function (category) {
        return categories.get(category);
    };

    this.update = function (newItems) {
        filters.populate();
        categories.populate(newItems);
        this.setData(newItems);
        populateAxisMenu();
    };

    this.setData = function (newItems) {
        items = newItems;
        renderer.setData(items);
    };

    function buildChart() {
        if (items) {
            renderer.update(items, axes.priceAxis, xAxis, colorAxis);
        }
    }

    function populateAxisMenu() {
        axisOptions = axes.listOptions();
        setContextMenu(".x.label", changeXAxis);
        setContextMenu("#chart-legend .title", changeColorAxis);
    }

    function setContextMenu(selector, callback) {
        $.contextMenu("destroy", {selector: selector});
        $.contextMenu({
            selector: selector,
            trigger: "left",
            callback: callback,
            items: getMenuItems()
        });
    }

    function getMenuItems() {
        return axisOptions.map(getMenuItem);
    }

    function getMenuItem(axis) {
        return {name: axis.label}
    }

    function changeXAxis(key) {
        xAxis = axisOptions[key];
        buildChart();
    }

    function changeColorAxis(key) {
        colorAxis = axisOptions[key];
        buildChart();
    }

    populateAxisMenu();
    xAxis = axisOptions[0];
    colorAxis = axisOptions[0];
    buildChart();

}

EbayChart.findOrdinalDomain = function (data, getProperty) {
    var uniqueValues = new Set();
    uniqueValues.addMap(data, getProperty);
    return uniqueValues.toArray().sort(naturalSort);
};

EbayChart.replaceUndefined = function(value) {
    return value ? value : "?";
};