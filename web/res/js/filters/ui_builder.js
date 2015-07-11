/**
 * Created by Victor on 11/07/2015.
 */
function FilterUIBuilder() {

    this.populate = function (filters) {
        populateFilters(filters);
        updateOptions(filters);
    };

    function populateFilters(filters) {
        var selFilter = d3.select("#filters")
            .selectAll("div").data(filters, getName)
            .enter().append("div");

        // title
        selFilter.append("a")
            .attr("href", "#")
            .html(getName);

        // values list
        selFilter.append("select")
            .attr("id", getFilterId)
            .attr("multiple", true)
            .attr("size", 10)
            .attr("onchange", "main.applyFilters()")
            .each(populateOptions);
    }

    function updateOptions(filters){
        d3.select("#filters")
            .selectAll("div").data(filters, getName)
            .select("select")
            .each(populateOptions)
    }

    this.selectOptions = function (filter) {
        return d3.select("#filters")
            .selectAll("select")
            .filter("[id=" + getFilterId(filter) + "]")
            .selectAll("option")
    };

    function populateOptions(filter) {
        var getLabel = labelGetter(filter);
        d3.select(this)
            .selectAll("option").data(filter.values, getLabel)
            .enter()
            .append("option")
            .html(getLabel);
    }

    function labelGetter(filter) {
        return filter.getValueLabel || getName;
    }

    function getFilterId(filter) {
        return "filter-" + filter.name;
    }

}