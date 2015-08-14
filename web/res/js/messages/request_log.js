/**
 * Created by Victor on 15/07/2015.
 */
var RequestLog = (function () {
    var module = {};

    module.logDivId = "#request-log";
    module.getHashKey = stringifyIdFields;

    var pageSize = 20;
    var requestHistory;

    module.init = function () {
        requestHistory = new Set(stringifyIdFields);
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

    module.notifyRequestSuccessful = function (params, metadata) {
        delete params.isPending;
        delete params.failed;
        countResults(params, metadata);
        requestHistory.add(params);
        updateUI();
    };

    function countResults(params, metadata) {
        params.lastItem = params.lastItem || 0;
        params.lastItem += metadata.itemsReturned;
        params.totalItems = metadata.totalItems;
    }

    module.notifyRequestFailed = function(params) {
        delete params.isPending;
        params.failed = true;
        updateUI();
    };

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
        params.aspects = sortFilters(params.aspects);
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
        idFields.aspects = params.aspects;
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