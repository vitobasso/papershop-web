function EbayUrlBuilder() {

    var APPID = "VictorBa-91f0-4b04-b497-3a5e426e0ece";

    this.buildFindUrl = function (params) {
        return "http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=findItemsAdvanced" +
            "&SERVICE-VERSION=1.0.0" +
            "&SECURITY-APPNAME=" + APPID +
            "&RESPONSE-DATA-FORMAT=json" +
            "&keywords=" + params.keywords +
            buildSiteFilter(params) +
            buildCategoryFilter(params) +
            buildCommonFilters(params) +
            buildEndFilter(params) +
            buildAspectFilters(params) +
            "&paginationInput.entriesPerPage=" + params.itemsPerPage +
            "&paginationInput.pageNumber=" + params.page;
    };

    function buildSiteFilter(params) {
        var result = "";
        var siteFilter = params.filters.find(filterNameEquals("Site"));
        if (siteFilter) {
            var site = siteFilter.selected[0];
            result += "&GLOBAL-ID=" + site.id;
        }
        return result;
    }

    function buildCategoryFilter(params) {
        var result = "";
        var categoryFilter = params.filters.find(filterNameEquals("Category"));
        if (categoryFilter) {
            var categories = categoryFilter.selected;
            categories.forEach(function (category, i) {
                result += "&categoryId(" + i + ")=" + category.id;
            });
        }
        return result;
    }

    function filterNameEquals(name) {
        return function (filterParam) {
            return filterParam.filter.name == name;
        };
    }

    function buildCommonFilters(params) {
        var filters = params.filters.filter(isCommonFilter);
        return buildFilters(itemBuilder, filters);
    }

    function isCommonFilter(filterParam) {
        return ['Condition', 'ListingType'].find(_ => _ == filterParam.filter.name);
    }

    function buildAspectFilters(params) {
        var filters = params.filters.filter(isAspectFilter);
        return buildFilters(aspectBuilder, filters);
    }

    function isAspectFilter(filterParam) {
        return filterParam.filter.category != undefined
            && !['Condition', 'ListingType', 'End'].find(_ => _ == filterParam.filter.name);
    }

    function buildFilters(paramBuilder, filterParams) {
        var result = "";
        if (filterParams) {
            filterParams.forEach(function (filterParam, i) {
                result += buildFilter(filterParam, i, paramBuilder);
            });
        }
        return result;
    }

    function buildFilter(filterParam, i, paramBuilder) {
        var result = paramBuilder.nameParam(i, filterParam.filter.name);
        var values = filterParam.selected.map(getId);
        values.forEach(function (value, j) {
            result += paramBuilder.valueParam(i, j, value);
        });
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

    function buildEndFilter(filtersParams) {
        var result = "";
        var endFilter = filtersParams.filters.find(filterNameEquals("End"));
        if (endFilter) {
            var nextIndex = filtersParams.filters.count(isCommonFilter);
            result += buildEndUrlParam(endFilter, nextIndex);
        }
        return result;
    }

    function buildEndUrlParam(param, nextIndex) {
        var result = "";
        var timeValue = RootCategoryCommon.getTimeValueForSelection(param)
        if (timeValue) {
            var dateStr = EbayApi.dateToString(timeValue);
            result = buildItemFilterUrlParam(nextIndex, "EndTimeTo", dateStr);
        }
        return result;
    }

    function buildItemFilterUrlParam(i, name, value) {
        return "&itemFilter(" + i + ").name=" + name
            + "&itemFilter(" + i + ").value(0)=" + value;
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