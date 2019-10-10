var ItemFilter = (function () {
    var module = {};

    module.createFilter = function (params) {
        return function (item) {
            return satisfiesFilters(item, params.filters);
        }
    };

    function satisfiesFilters(item, filters) {
        for (var i = 0, filter; filter = filters[i]; i++) {
            if (!satisfiesFilter(item, filter)) {
                return false;
            }
        }
        return true;
    }

    function satisfiesFilter(item, filterParam) {
        if (!filterParam.selected.length) {
            return true;
        } else {
            var filter = filterParam.filter;
            if (filter.satisfies) { //for properties with a specific logic (e.g.: time, which is not a discrete set of values)
                return filter.satisfies(item, filterParam);
            } else {
                return satisfiesOrdinalFilter(item, filterParam);
            }
        }
    }

    function satisfiesOrdinalFilter(item, filterParam) {
        var getValueId = itemPropertyIdGetter(filterParam.filter);
        var valueId = getValueId(item);
        var filterValues = filterParam.selected.map(getId);
        return filterValues.contains(valueId);
    }

    function itemPropertyIdGetter(aspect) {
        return _.compose(getId, aspect.getFromItem);
    }

    return module;
}());