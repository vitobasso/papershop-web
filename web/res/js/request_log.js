/**
 * Created by Victor on 15/07/2015.
 */
var RequestLog = (function () {
    var module = {};

    module.divId = "#request-log";
    module.getHashKey = stringifyIdFields;

    var pageSize = 20;
    var requestHistory;

    module.init = function () {
        requestHistory = new Set(stringifyIdFields);
        RequestLogUI.update(); //init hidden
    };

    module.getHistory = function () {
        return requestHistory.toArray();
    };

    module.notifyNewRequestAndGetPaging = function (paramsFromUI) {
        var result = setPagingOnParams(paramsFromUI);
        result.isPending = true;
        requestHistory.add(result);
        RequestLogUI.update();
        return result;
    };

    module.notifyRequestSuccessful = function (params) {
        delete params.isPending;
        params.lastItem = params.itemsPerPage * params.page;
        requestHistory.add(params);
        RequestLogUI.update();
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
        var lastItem = params.lastItem; // last item requested
        var lastPage = Math.floor(lastItem / pageSize); // regarding current pageSize (we can repeat but not mess items)
        params.itemsPerPage = pageSize;
        params.page = lastPage + 1;
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
        var names = filters.map(getName).sort(naturalSort);
        var map = mapAsObject(filters, getName);
        return names.map(function (name) {
            return map[name];
        })
    }

    function sortValues(filter) {
        filter.values = filter.values.sort(naturalSort);
    }

    function stringifyIdFields(params) {
        var idFields = {};
        idFields.keywords = params.keywords;
        idFields.filters = params.filters;
        idFields.aspects = params.aspects;
        return JSON.stringify(idFields);
    }

    return module;
}());