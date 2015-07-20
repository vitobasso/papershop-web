/**
 * Created by Victor on 05/07/2015.
 */

function ChartManager() {

    var filters = new Filters(),
        categories = new Categories(),
        axes = new AxisFactory(categories),
        renderer = new ChartRenderer(),
        items = [];

    var axisOptions, xAxis;

    this.getCategory = function (category) {
        return categories.get(category);
    };

    this.update = function (newItems) {
        populateFilters(newItems);
        this.setData(newItems);
        axisOptions = axes.listOptions();
    };

    this.setData = function (newItems) {
        items = newItems;
        renderer.setData(items);
    };

    function buildChart() {
        if (items) {
            renderer.update(items, axes.priceAxis, xAxis);
        }
    }

    ////////////////////////////////////////////////////////////////////////

    function populateFilters(newItems) {
        filters.populate();
        categories.populate(newItems);
        setFilterTitleClickListener();
    }

    function setFilterTitleClickListener() {
        $("#filters").find("> .filter").on("click", function (e) {
            var filterName = this.__data__.name;
            changeAxisByName(filterName);
        });
    }

    function changeAxisByName(name) {
        var axis = axisOptions.find(labelEquals(name));
        if(axis) {
            xAxis = axis;
            buildChart();
        }
    }

    function labelEquals(name) {
        return function(axis) {
            return axis.label == name
        }
    }

    ////////////////////////////////////////////////////////////////////////

    axisOptions = axes.listOptions();
    xAxis = axisOptions[0];
    buildChart();

}

ChartManager.findOrdinalDomain = function (data, getProperty) {
    var uniqueValues = new Set();
    uniqueValues.addMap(data, getProperty);
    return uniqueValues.toArray().sort(naturalSort);
};

ChartManager.replaceUndefined = function (value) {
    return value ? value : "?";
};