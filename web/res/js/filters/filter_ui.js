/**
 * Created by Victor on 11/07/2015.
 */
var FilterUI = (function () {
    var module = {};

    module.populate = function (filters) {
        populateFilters(filters);
        updateOptions(filters);
        ListenerAssigner.bindFilterListeners();
        return selectDivs(filters);
    };

    function populateFilters(filters) {
        var selFilter = selectDivs(filters)
            .enter().append("div")
            .classed("filter", true);

        // top
        var top = selFilter.append("div")
            .classed("top", true);

        // arrow
        top.append("div")
            .classed("expander", true)
            .append("div")
            .classed("arrow", true)
            .classed("right", true);

        // title
        top.append("div")
            .classed("title", true)
            .html(getName);
    }

    function populateSelect(selFilter) {
        selFilter.append("select")
            .attr("id", getFilterId)
            .each(populateOptions);
    }

    function updateOptions(filters) {
        selectDivs(filters)
            .select("select")
            .each(populateOptions)
    }

    function populateOptions(filter) {
        var getLabel = filter.getValueLabel;
        d3.select(this)
            .attr("size", filter.values.length)
            .attr("multiple", true);
        d3.select(this)
            .selectAll("option").data(filter.values, getLabel)
            .enter()
            .append("option")
            .html(getLabel);
    }

    function selectDivs(filters) {
        return d3.select("#filters")
            .selectAll("div.filter").data(filters, getName);
    }

    function getFilterId(filter) {
        return "filter-" + filter.name;
    }

    module.refresh = function () {
        d3.select("#filters")
            .selectAll("div.filter")
            .selectAll(".arrow")
            .classed("active", isXAxis);
    };

    //TODO mark filter used on chart in the UI
    function isXAxis(filter) {
        var xAxis = ChartManager.getXAxis();
        return xAxis && filter.name == xAxis.label;
    }

    module.toggleExpanded = function (filterDiv) {
        var selSelect = $(filterDiv).find("select");
        if (selSelect.length) {
            setFilterCollapsed(filterDiv, selSelect);
        } else {
            setFilterExpanded(filterDiv);
        }
    };

    function setFilterExpanded(filterDiv) {
        var selFilter = d3.select(filterDiv);
        populateSelect(selFilter);
        ListenerAssigner.bindFilterListeners();
        setArrowExpanded(filterDiv);
    }

    function setFilterCollapsed(filterDiv, selSelect) {
        selSelect.remove();
        setArrowCollapsed(filterDiv);
    }

    function setArrowExpanded(filterDiv) {
        d3.select(filterDiv).select(".arrow")
            .classed("bottom", true)
            .classed("right", false);
    }

    function setArrowCollapsed(filterDiv) {
        d3.select(filterDiv).select(".arrow")
            .classed("bottom", false)
            .classed("right", true);
    }

    return module;
}());