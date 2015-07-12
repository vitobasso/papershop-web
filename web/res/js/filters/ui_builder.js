/**
 * Created by Victor on 11/07/2015.
 */
function FilterUIBuilder() {

    this.populate = function (filters) {
        populateFilters(filters);
        updateOptions(filters);
        return selectDivs(filters);
    };

    function populateFilters(filters) {
        var selFilter = selectDivs(filters)
            .enter().append("div");

        // title
        selFilter.append("a")
            .attr("href", "#")
            .html(getName);

        // values list
        selFilter.append("select")
            .attr("id", getFilterId)
            .attr("multiple", true)
            .attr("onchange", "main.applyFilters()")
            .each(populateOptions);
    }

    function updateOptions(filters){
        selectDivs(filters)
            .select("select")
            .each(populateOptions)
    }

    function populateOptions(filter) {
        var getLabel = labelGetter(filter);
        d3.select(this)
            .selectAll("option").data(filter.values, getLabel)
            .enter()
            .append("option")
            .html(getLabel);
    }

    function selectDivs(filters) {
        return d3.select("#filters")
            .selectAll("div").data(filters, getName);
    }

    function labelGetter(filter) {
        return filter.getValueLabel || getName;
    }

    function getFilterId(filter) {
        return "filter-" + filter.name;
    }

}