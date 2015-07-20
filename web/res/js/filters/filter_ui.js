/**
 * Created by Victor on 11/07/2015.
 */
function FilterUI() {

    this.populate = function (filters) {
        populateFilters(filters);
        updateOptions(filters);
        return selectDivs(filters);
    };

    function populateFilters(filters) {
        var selFilter = selectDivs(filters)
            .enter().append("div")
            .classed("filter", true);

        // title
        selFilter.append("div")
            .classed("title", true)
            .html(getName);

        // values list
        selFilter.append("select")
            .attr("id", getFilterId)
            .attr("multiple", true)
            .on("change", Main.applyFilters)
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
            .selectAll("div.filter").data(filters, getName);
    }

    function labelGetter(filter) {
        return filter.getValueLabel || getName;
    }

    function getFilterId(filter) {
        return "filter-" + filter.name;
    }

}