/**
 * Created by Victor on 05/07/2015.
 */
var ChartManager = (function () {
    var module = {};

    var items;
    var axisOptions, xAxis;

    module.init = _ => {
        items = [];
        $.subscribe('new-items', onNewItems);
        $.subscribe('apply-filter', onApplyFilter);
        module.updateAxisOptions(); //FIXME depends on Categories
        xAxis = axisOptions[0];
        buildChart(); //FIXME depends on ChartRenderer
    };

    function onNewItems(_, newItems) {
        populateFilters(newItems);
        module.updateAxisOptions();
        setData(newItems);
    }

    function onApplyFilter(_, items){
        setData(items);
    }

    function setData(newItems) {
        items = newItems;
        ChartRenderer.setData(items);
    }

    module.updateAxisOptions = _ => {
        axisOptions = AxisFactory.listOptions();
    };

    function buildChart() {
        if (items) {
            ChartRenderer.update(items, AxisFactory.priceAxis, xAxis);
        }
    }

    ////////////////////////////////////////////////////////////////////////

    function populateFilters(newItems) {
        Filters.populate();
        Categories.populate(newItems);
    }

    module.changeAxisByName = name => {
        var axis = axisOptions.find(labelEquals(name));
        if (axis) {
            xAxis = axis;
            buildChart();
        }
    };

    module.getXAxis = _ => xAxis;

    function labelEquals(name) {
        return function (axis) {
            return axis.label == name
        }
    }

    return module;
}());
