
var FilterUI = (function () {
    var module = {};

    module.populate = function (filters) {
        populateFilters(filters);
        updateItems(filters);
        HandlerAssigner.bindFilterListeners();
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

    function populateList(selFilter) {
        selFilter.append("ul")
            .attr("id", getFilterId)
            .each(populateItems);
    }

    function updateItems(filters) {
        selectDivs(filters)
            .select("ul")
            .each(populateItems)
    }

    function populateItems(filter) {
        var getLabel = filter.getValueLabel;
        var li = d3.select(this)
            .selectAll("li").data(filter.values, getLabel)
            .enter()
            .append("li")
        li.append("input").attr("type", "checkbox").property("checked", isChecked)
        li.append("label").html(getLabel);
    }

    function isChecked(d){
        return d.checked;
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
            .classed("active", isXAxis);
    };

    function isXAxis(filter) {
        var xAxis = ChartManager.getXAxis();
        return xAxis && filter.name == xAxis.label;
    }

    module.toggleExpanded = function (filterDiv) {
        var selSelect = $(filterDiv).find("ul");
        if (selSelect.length) {
            setFilterCollapsed(filterDiv, selSelect);
        } else {
            setFilterExpanded(filterDiv);
        }
    };

    function setFilterExpanded(filterDiv) {
        var selFilter = d3.select(filterDiv);
        populateList(selFilter);
        HandlerAssigner.bindFilterListeners();
        setArrowExpanded(filterDiv);
    }

    function setFilterCollapsed(filterDiv, selList) {
        selList.remove();
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