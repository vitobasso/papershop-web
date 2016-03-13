
var RequestLogUI = (function () {
    var module = {};

    var divId = RequestLog.logDivId;

    module.init = function () {
        module.update();
        $(divId).dialog({
            autoOpen: false
        });
        HandlerAssigner.bindRequestLogDialog();
    };

    module.update = function () {
        var history = RequestLog.getHistory();
        render(history);
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

        selection
            .classed("flashing-bg", isPending)
            .classed("failed", isFailed);
        selection.html("");
        selection.append("td")
            .classed("description", true)
            .html(getParamsString);
        selection.append("td")
            .classed("count", true)
            .html(getResultsCount);
    }

    function getParamsString(params) {
        var filtersStr = getFiltersString(params.filters);
        var aspectsStr = getFiltersString(params.aspects);
        var parts = [params.keywords, filtersStr, aspectsStr].filter(notEmpty);
        return parts.join(", ");
    }

    function getFiltersString(filterParams) {
        if (!filterParams) {
            return "";
        }
        var filterStrings = filterParams.map(getFilterString);
        return filterStrings.join(", ");
    }

    function getFilterString(filterParam) {
        var labels = filterParam.selected.map(getName);
        return labels.join(", ");
    }

    function isPending(params) {
        return params.isPending == true;
    }

    function isFailed(params) {
        return params.failed == true;
    }

    function getResultsCount(params) {
        var result = "";
        if (params.lastItem) {
            result += params.lastItem;
        }
        if (params.totalItems) {
            result += "/" + formatBigNumber(params.totalItems);
        }
        return result;
    }

    function formatBigNumber(num) {
        if (num > BI) {
            return Math.floor(num / BI) + "bi";
        } else if (num > MI) {
            return Math.floor(num / MI) + "mi";
        } else if (num > 1000) {
            return Math.floor(num / 1000) + "k";
        } else {
            return num;
        }
    }

    var MI = Math.pow(1000, 2);
    var BI = Math.pow(1000, 3);

    return module;
}());