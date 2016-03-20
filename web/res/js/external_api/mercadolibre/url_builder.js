
function MLUrlBuilder() {

    this.buildFindUrl = function (params) {
        return "https://api.mercadolibre.com/sites/" + "MLB" + "/search?" +
            "q=" + params.keywords +
            buildCategoryFilter(params) +
            buildFilters(params) +
            buildEndFilter(params) +
            buildPaging(params);
    };

    function buildCategoryFilter(params) {
        var result = "";
        var param = params.filters.find(filterNameEquals("Category"));
        if (param) {
            //TODO ml allows 1 category, ebay allows multiple. make it clear in the UI
            var category = param.selected[0];
            result += "&category=" + category;
        }
        return result;
    }

    function buildFilters(params) {
        var result = "";
        var params = params.filters.filter(isCommonFilter);
        if (params) {
            params.forEach(param => {
                var values = param.selected.map(getId);
                //TODO ml allows 1 filter, ebay allows multiple. make it clear in the UI
                result += "&" + param.filter.id + "=" + values[0];
            });
        }
        return result;
    }

    function buildEndFilter(params) {
        var result = "";
        var endFilter = params.filters.find(filterNameEquals("End"));
        if (endFilter) {
            result += buildEndParam(endFilter)
        }
        return result;
    }

    function buildEndParam(param) {
        var result = "";
        if (param && param.selected.length) {
            var selected = param.selected[0];
            if (["In 1 day", "In 1 hour"].find(equals(selected.id))) {
                result = "&until=today"; //ml's only option for filtering "End"
            }
        }
        return result;
    }

    function filterNameEquals(name) {
        return param => param.filter.name == name;
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