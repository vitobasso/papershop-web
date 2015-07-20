/**
 * Created by Victor on 05/07/2015.
 */

function EbayUrlBuilder() {

    var APPID = "VictorBa-91f0-4b04-b497-3a5e426e0ece";

    this.buildFindUrl = function (params) {
        return "http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=findItemsAdvanced" +
            "&SERVICE-VERSION=1.0.0" +
            "&SECURITY-APPNAME=" + APPID +
            "&RESPONSE-DATA-FORMAT=json" +
            "&keywords=" + params.keywords +
            buildCategoryFilters(params) +
            buildCommonFilters(params) +
            buildAspectFilters(params) +
            "&paginationInput.entriesPerPage=" + params.itemsPerPage +
            "&paginationInput.pageNumber=" + params.page;
    };

    function isCategoryFilter(filter) {
        return filter.name == "Category";
    }

    function buildCategoryFilters(params) {
        var result = "";
        var categoryFilter = params.filters.find(isCategoryFilter);
        if (categoryFilter) {
            var categoryIds = categoryFilter.values;
            categoryIds.forEach(function (categoryId, i) {
                result += "&categoryId(" + i + ")=" + categoryId;
            });
        }
        return result;
    }

    function buildCommonFilters(params) {
        var commonFilters = params.filters.filter(isCommonFilter); // remove "Category"
        return buildFilters(itemBuilder, commonFilters);
    }

    function isCommonFilter(filter) {
        return filter.name != "Category";
    }

    function buildAspectFilters(params) {
        return buildFilters(aspectBuilder, params.aspects);
    }

    function buildFilters(paramBuilder, filters) {
        var result = "";
        if (filters) {
            filters.forEach(function (filter, i) {
                result += paramBuilder.nameParam(i, filter.name);
                filter.values.forEach(function (value, j) {
                    result += paramBuilder.valueParam(i, j, value);
                });
            });
        }
        return result;
    }

    var itemBuilder = {
        nameParam: function (i, name) {
            return "&itemFilter(" + i + ").name=" + name;
        },
        valueParam: function (i, j, value) {
            return "&itemFilter(" + i + ").value(" + j + ")=" + value;
        }
    };

    var aspectBuilder = {
        nameParam: function (i, name) {
            return "&aspectFilter(" + i + ").aspectName=" + name;
        },
        valueParam: function (i, j, value) {
            return "&aspectFilter(" + i + ").aspectValueName(" + j + ")=" + value;
        }
    };

    this.buildHistogramsUrl = function (params) {
        return "http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=getHistograms" +
            "&SERVICE-VERSION=1.0.0" +
            "&SECURITY-APPNAME=" + APPID +
            "&RESPONSE-DATA-FORMAT=json" +
            "&categoryId=" + params.categoryId
    };

}