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
        $(filterClass).find("ul").each(function (i, filterNode) {
            var sel = $(filterNode).find("li").filter(hasCheckedInput);
            if (sel.length > 0) {
                var filter = getFilterFromUI(filterNode.__data__, sel);
                filters.push(filter);
            }
        });
        return filters;
    }

    function hasCheckedInput(){
        var checkedInputs = $(this).find("input").filter(isChecked)
        return checkedInputs.length > 0;
    }

    function isChecked(){
        return this.checked
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