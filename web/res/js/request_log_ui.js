/**
 * Created by Victor on 15/07/2015.
 */
function RequestLogUI(divId, requestLog) {

    this.update = render;

    function render() {
        var history = requestLog.getHistory();
        var selEntries = d3.select(divId).select("table")
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
            .classed("description", true)
            .html(getParamsString);
        selection.append("td")
            .html(getLastItem);
        selection.append("td")
            .append("div")
            .classed("status", true)
            .classed("loading-anim", isPending);

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

    function isPending(params) {
        return params.isPending == true;
    }

    function getLastItem(params) {
        return params.lastItem;
    }

}