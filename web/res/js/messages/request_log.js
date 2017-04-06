
var RequestLog = (function () {
    var module = {};

    module.getHashKey = stringifyIdFields;

    var pageSize = 20;
    var requestHistory;

    module.init = function () {
        requestHistory = new Set(stringifyIdFields);
        $.subscribe('find-items', onRequestSuccessful);
        $.subscribe('find-items-failed', onRequestFailed);
    };

    module.getHistory = function () {
        return requestHistory.toArray();
    };

    module.notifyNewRequestAndGetPaging = function (paramsFromUI) {
        var result = setPagingOnParams(paramsFromUI);
        result.isPending = true;
        requestHistory.add(result);
        updateUI();
        return result;
    };

    function onRequestSuccessful(_, params, result) {
        var entry = requestHistory.get(params)
        delete entry.isPending;
        delete entry.failed;
        countResults(entry, result.metadata);
        updateUI();

        function countResults(entry, metadata) {
            entry.lastItem = entry.lastItem || 0;
            entry.lastItem += metadata.itemsReturned;
            entry.totalItems = metadata.totalItems;
        }
    }

    function onRequestFailed(_, params) {
        var entry = requestHistory.get(params)
        delete entry.isPending;
        entry.failed = true;
        updateUI();
    }

    function setPagingOnParams(paramsFromUI) {
        // given keyword and filters, generate paging params based on request history
        var stdParams = standardizeParams(paramsFromUI);
        var storedParams = requestHistory.get(stdParams);
        var result;
        if (storedParams) {
            result = setPagingForRecurrentParams(storedParams);
        } else {
            result = setPagingForNewParams(stdParams);
        }
        return result;
    }

    function setPagingForNewParams(params) {
        params.itemsPerPage = pageSize;
        params.page = 1;
        return params;
    }

    function setPagingForRecurrentParams(params) {
        var prevPage = params.page || 0;;
        params.page = prevPage + 1;
        params.itemsPerPage = pageSize;
        return params;
    }

    function standardizeParams(params) {
        // sort filters & their values so hash functions have same results regardless of order
        params.filters = sortFilters(params.filters);
        return params;
    }

    function sortFilters(filters) {
        filters.forEach(sortValues);
        var names = filters.map(getFilterName).sort(naturalSort);
        var map = mapAsObject(filters, getFilterName);
        return names.map(function (name) {
            return map[name];
        })
    }

    function sortValues(filter) {
        filter.selected = filter.selected.sort(naturalSort);
    }

    function stringifyIdFields(params) {
        var idFields = {};
        idFields.keywords = params.keywords;
        idFields.filters = params.filters;
        return JSON.stringify(idFields);
    }

    function getFilterName(filterParam) {
        return filterParam.filter.name
    }

    function updateUI() {
        MessageUI.updateRequestStatus();
        RequestLogUI.update();
    }

    return module;
}());