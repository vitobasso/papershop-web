/**
 * Created by Victor on 15/07/2015.
 */
function RequestLogUI(tableId, requestLog) {

    this.render = render;

    function render() {
        var history = requestLog.getHistory();
        var selEntries = d3.select(tableId)
            .selectAll("tr").data(history, requestLog.getHashKey);
        selEntries.call(renderRequestRow);
        selEntries.enter().append("tr")
            .call(renderRequestRow);
        selEntries.exit().remove();
    }

    function renderRequestRow(selection) {
        if (selection.empty()) {
            return;
        }

        selection.html("");
        selection.append("td")
            .classed("request-filters", true)
            .html(getParamsString);
        selection.append("td")
            .classed("request-count", true)
            .html(function (params) {
                return params.lastItem;
            });
        selection.append("td")
            .classed("request-state", true)
            .html("*");

    }

    function getParamsString(params) {
        var filtersStr = getFiltersString(params.filters);
        var aspectsStr = getFiltersString(params.aspects);
        var parts = [params.keywords, filtersStr, aspectsStr].filter(notEmpty);
        return parts.join(", ");
    }

    function getFiltersString(filters) {
        if (!filters) {
            return "";
        }
        var filterStrings = filters.map(getFilterString);
        return filterStrings.join(", ");
    }

    function getFilterString(filter) {
        return filter.values.join(", ");
    }

}