/**
 * Created by Victor on 15/07/2015.
 */
function RequestLog() {

    var pageSize = 20;
    var requestHistory = new Set(stringifyIdFields);

    this.getHistory = getHistory;

    this.createNextPageParams = createNextPageParams;

    this.getHashKey = stringifyIdFields;

    function getHistory() {
        return requestHistory.toArray();
    }

    function createNextPageParams(uiParams) {
        // given keyword and filters, generate paging params based on request history
        var stdParams = standardizeParams(uiParams);
        var oldParams = requestHistory.get(stdParams);
        var result;
        if(oldParams) {
            result = getParamsForRepeatedRequest(oldParams);
        } else {
            result = getParamsForNewRequest(stdParams);
        }
        updateSet(result);
        return result;
    }

    function getParamsForNewRequest(rawParams) {
        rawParams.itemsPerPage = pageSize;
        rawParams.page = 1;
        return rawParams;
    }

    function getParamsForRepeatedRequest(oldParams) {
        var lastItem = oldParams.lastItem; // last item requested
        var lastPage = Math.floor(lastItem / pageSize); // regarding current pageSize (we can repeat but not mess items)
        oldParams.itemsPerPage = pageSize;
        oldParams.page = lastPage + 1;
        return oldParams;
    }

    function updateSet(newParams) {
        newParams.lastItem = newParams.itemsPerPage * newParams.page;
        requestHistory.add(newParams);
    }

    function standardizeParams(params){
        // sort filters & their values so hash functions have same results regardless of order
        params.filters = sortFilters(params.filters);
        params.aspects = sortFilters(params.aspects);
        return params;
    }

    function sortFilters(filters) {
        filters.forEach(sortValues);
        var names = filters.map(getName).sort(naturalSort);
        var map = mapAsObject(filters, getName);
        return names.map(function(name) {
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

}