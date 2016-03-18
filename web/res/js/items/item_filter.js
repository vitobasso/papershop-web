
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
            if (filter.satisfies) {
                return filter.satisfies(item, filterParam);
            } else {
                return satisfiesOrdinalFilter(item, filterParam);
            }
        }
    }

    function satisfiesOrdinalFilter(item, filterParam){
        var filterName = filterParam.filter.name;
        var getProperty = itemPropertyIdGetter(filterName);
        var property = getProperty(item);
        var filterValues = filterParam.selected.map(getId);
        return filterValues.contains(property);
    }

    function itemPropertyIdGetter(propertyName) {
        return itemPropertyGetters[propertyName]
            || getItemAspectByFilter(propertyName);
    }

    //TODO remove, make all aspect(id, name)
    var itemPropertyGetters = {
        Condition: item => item.condition.id,
        ListingType: item => item.listingType.id,
        Category: item => item.category.id
    };

    //TODO remove, make all aspect(id, name)
    function getItemAspectByFilter(aspectName) {
        return function (item) {
            var aspect = item.aspects[aspectName] || {};
            return aspect.value;
        }
    }

    return module;
}());