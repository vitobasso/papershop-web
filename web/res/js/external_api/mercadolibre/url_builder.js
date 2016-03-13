
function MLUrlBuilder() {

    this.buildFindUrl = function (params) {
        return "https://api.mercadolibre.com/sites/" + "MLB" + "/search?" +
            "q=" + params.keywords +
            buildCategoryFilter(params) +
            buildFilters(params) +
            buildPaging(params);
    };

    function buildCategoryFilter(params) {
        var result = "";
        var categoryFilter = params.filters.find(filterNameEquals("Category"));
        if (categoryFilter) {
            //TODO ml allows 1 category, ebay allows multiple. make it clear in the UI
            var category = categoryFilter.selected[0];
            result += "&category=" + category;
        }
        return result;
    }

    function filterNameEquals(name) {
        return function(filterParam) {
            return filterParam.filter.name == name;
        };
    }

    function buildFilters(params) {
        var result = "";
        var filterParams = params.filters.filter(isCommonFilter);;
        if (filterParams) {
            filterParams.forEach(function (filterParam, i) {
                var values = filterParam.selected.map(getId);
                //TODO ml allows 1 category, ebay allows multiple. make it clear in the UI
                result += "&" + filterParam.filter.name + "=" + values[0];
            });
        }
        return result;
    }

    function isCommonFilter(filterParam) {
        var name = filterParam.filter.name;
        return name != "Category";
    }

    function buildPaging(params) {
        var limit = params.itemsPerPage;
        var offset = params.page * limit;
        var result = "";
        if(limit) {
            result += "&limit=" + limit;
        }
        if(offset) {
            result += "&offset=" + offset;
        }
        return result;
    }

}