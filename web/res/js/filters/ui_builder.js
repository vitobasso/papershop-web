/**
 * Created by Victor on 11/07/2015.
 */
function FilterUIBuilder() {

    this.populate = function (rootSelection, filters) {

        var selFilter = rootSelection
            .select("ul")
            .selectAll("li").data(filters, getName)
            .enter().append("li");

        // title
        selFilter.append("a")
            .attr("href", "#")
            .html(getName);

        // values list
        selFilter.append("select")
            .attr("multiple", true)
            .attr("size", function (filter) {
                return filter.values.length;
            })
            .attr("onchange", "main.applyFilters()")
            .each(populateValues);

    };

    function populateValues(filter) {
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

}