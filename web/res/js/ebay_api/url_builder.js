/**
 * Created by Victor on 05/07/2015.
 */

function EbayUrlBuilder(){

    var APPID = "VictorBa-91f0-4b04-b497-3a5e426e0ece";

    this.buildFindUrl = function (params) {
        return "http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=findItemsAdvanced" +
            "&SERVICE-VERSION=1.0.0" +
            "&SECURITY-APPNAME=" + APPID +
            "&RESPONSE-DATA-FORMAT=json" +
            "&keywords=" + params.keywords +
            buildCategory(params.category) +
            buildFilter(params.filters) +
            buildAspectFilter(params.aspects) +
            "&paginationInput.entriesPerPage=" + params.itemsPerPage +
            "&paginationInput.pageNumber=" + params.page;
    };

    function buildCategory(categoryId) {
        var result = "";
        if (categoryId) {
            result = "&categoryId=" + categoryId;
        }
        return result;
    }

    function buildFilter(filters) {
        var result = "";
        if (filters) {
            filters.forEach(function (filter, i) {
                result += "&itemFilter(" + i + ").name=" + filter.name;
                filter.values.forEach(function (value, j) {
                    result += "&itemFilter(" + i + ").value(" + j + ")=" + value;
                });
            });
        }
        return result;
    }

    //TODO unify with similar code from buildFilter()
    function buildAspectFilter(filters) {
        var result = "";
        if (filters) {
            filters.forEach(function (filter, i) {
                result += "&aspectFilter(" + i + ").aspectName=" + filter.name;
                filter.values.forEach(function (value, j) {
                    result += "&aspectFilter(" + i + ").aspectValueName(" + j + ")=" + value;
                });
            });
        }
        return result;
    }

    this.buildHistogramsUrl = function (params) {
        return "http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=getHistograms" +
            "&SERVICE-VERSION=1.0.0" +
            "&SECURITY-APPNAME=" + APPID +
            "&RESPONSE-DATA-FORMAT=json" +
            "&categoryId=" + params.categoryId
    };

}