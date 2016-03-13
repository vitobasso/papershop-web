
var ChartManager = (function () {
    var module = {};

    var items;
    var axisOptions, xAxis;

    module.init = _ => {
        items = [];
        $.subscribe('new-items', onNewItems);
        $.subscribe('apply-filter', onApplyFilter);
        $.subscribe('new-aspects', updateAxisOptions);
        updateAxisOptions(); //FIXME depends on Categories
        xAxis = axisOptions[0];
        buildChart(); //FIXME depends on ChartRenderer
    };

    function onNewItems(_, newItems, filtered) {
        updateAxisOptions();
        setData(filtered);
    }

    function onApplyFilter(_, filtered){
        setData(filtered);
    }

    function setData(newItems) {
        items = newItems;
        ChartRenderer.setData(items);
    }

    function updateAxisOptions() {
        axisOptions = AxisFactory.listOptions();
    }

    function buildChart() {
        if (items) {
            ChartRenderer.update(items, AxisFactory.priceAxis, xAxis);
        }
    }

    ////////////////////////////////////////////////////////////////////////


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
