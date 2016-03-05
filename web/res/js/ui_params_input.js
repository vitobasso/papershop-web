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
        $(filterClass).each(function (i, filterNode) {
            var data = filterNode.__data__;
            var selected = data.values.filter(isChecked);
            if(selected.length > 0){
                filters.push({
                    filter: data,
                    selected: selected
                });
            }
        })
        return filters;
    }

    function isChecked(item){
        return item.checked
    }


    return module;
}());