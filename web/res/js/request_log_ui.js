/**
 * Created by Victor on 15/07/2015.
 */
var RequestLogUI = (function () {
    var module = {};

    var divId = RequestLog.divId;

    module.update = function () {
        var history = RequestLog.getHistory();
        if (history.length > 0) {
            $(divId).show();
            render(history);
        } else {
            hide();
        }
    };

    function render(history) {
        var selEntries = d3.select(divId)
            .select("table")
            .select("tbody")
            .selectAll("tr").data(history, RequestLog.getHashKey);
        selEntries.call(renderRequestRow);
        selEntries.enter().append("tr")
            .call(renderRequestRow);
        selEntries.exit().remove();
    }

    function renderRequestRow(selection) {
        if (selection.empty()) {
            return;
        }

        selection.classed("flashing-bg", isPending)
        selection.html("");
        selection.append("td")
            .classed("description", true)
            .html(getParamsString);
        selection.append("td")
            .classed("count", true)
            .html(getLastItem);
    }

    function hide() {
        $(divId).hide();
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

    return module;
}());