
var ChartManager = (function () {
    var module = {};

    var items;
    var axisOptions, xAxis, yAxis;

    module.init = _ => {
        items = []
        $.subscribe('new-items', onNewItems)
        $.subscribe('apply-filter', onApplyFilter)
        $.subscribe('new-filters', updateAxisOptions)
        updateAxisOptions() //FIXME depends on Aspects
        yAxis = axisOptions[0]
        xAxis = axisOptions[0]
        buildChart() //FIXME depends on ChartRenderer
    };

    function onNewItems(_, _, filtered) {
        updateAxisOptions();
        autoSelectAxes();
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

    function autoSelectAxes(){
        var anyAxisChanged = false
        if(yAxis.label == "?") {
            const priceAxis = axisOptions.find(x => x.label.toLowerCase() == "price")
            const candidate = priceAxis || axisOptions.find(x => x.label != "?")
            yAxis = candidate || yAxis
            anyAxisChanged = candidate
        }
        if(xAxis.label == "?") {
            const candidate = axisOptions.filter(x => x.label.toLowerCase() != "price")
                                         .find(x => x.label != "?")
            xAxis = candidate || xAxis
            anyAxisChanged = anyAxisChanged || candidate
        }
        if(anyAxisChanged) {
            buildChart()
        }
    }

    function buildChart() {
        if (items) ChartRenderer.update(items, yAxis, xAxis);
    }

    ////////////////////////////////////////////////////////////////////////


    module.changeXAxisByName = name => {
        var axis = axisOptions.find(x => x.label == name);
        if (axis) {
            xAxis = axis;
            buildChart();
        }
    };

    module.changeYAxisByName = name => {
        var axis = axisOptions.find(y => y.label == name);
        if (axis) {
            yAxis = axis;
            buildChart();
        }
    };

    module.getXAxis = _ => xAxis;
    module.getYAxis = _ => yAxis;

    return module;
}());
