
var UIParamsInput = (function() {
    var module = {};

    module.getParams = function () {
        return {
            keywords: $("#search-field").val(),
            filters: getFiltersFromUI()
        };
    };

    function getFiltersFromUI() {
        return $('.filter').get()
            .map(nodeToFilter)
            .filter(hasSelection);
    }

    function nodeToFilter(filterNode) {
        var data = filterNode.__data__;
        var selected = data.values.filter(isChecked);
        return {
            filter: data,
            selected: selected
        }
    }

    function hasSelection(filterNode){
        return filterNode.selected.length > 0;
    }

    function isChecked(item){
        return item.checked
    }

    return module;
}());