/**
 * Created by Victor on 19/07/2015.
 */
var UIParamsInput = (function() {
    var module = {};

    module.getParams = function () {
        return {
            keywords: $("#search-field").val(),
            filters: getFiltersFromUI(".common-filter"),
            aspects: getFiltersFromUI(".aspect-filter")
        };
    };

    function getFiltersFromUI(filterClass) {
        var filters = [];
        $(filterClass).find("select").each(function (i, filterNode) {
            var sel = $(filterNode).find("option").filter(":selected");
            if (sel.length > 0) {
                var filter = getFilterFromUI(filterNode.__data__, sel);
                filters.push(filter);
            }
        });
        return filters;
    }

    function getFilterFromUI(filter, selectedOptions) {
        return {
            filter: filter,
            selected: selectedOptions.toArray().map(function (option) {
                return option.__data__;
            })
        }
    }

    return module;
}());