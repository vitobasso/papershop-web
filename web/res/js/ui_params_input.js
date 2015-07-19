/**
 * Created by Victor on 19/07/2015.
 */
function UIParamsInput() {

    this.getParams = getParams;

    function getParams() {
        return {
            keywords: $("#keywords").val(),
            filters: getFiltersFromUI(".common-filter"),
            aspects: getFiltersFromUI(".aspect-filter")
        };
    }

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
            name: filter.name,
            values: selectedOptions.toArray().map(function (option) {
                var getValueId = filterValueIdGetter(filter);
                return getValueId(option.__data__)
            })
        }
    }

    function filterValueIdGetter(filter) {
        return filter.getValueId || getName;
    }

}