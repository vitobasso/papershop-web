/**
 * Created by Victor on 11/07/2015.
 */
var ItemFilter = (function () {
    var module = {};

    module.createFilter = function (params) {
        return function (item) {
            return filterItem(item, params);
        }
    };

    function filterItem(item, params) {
        return satisfiesFilters(item, params.filters)
            && satisfiesFilters(item, params.aspects);
    }

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
        var filterValues = filterSelectionIds(filterParam);
        return filterValues.contains(property);
    }

    function filterSelectionIds(filterParam) {
        var getId = filterParam.filter.getValueId;
        return filterParam.selected.map(getId);
    }

    function itemPropertyIdGetter(propertyName) {
        return itemPropertyGetters[propertyName]
            || getItemAspectByFilter(propertyName);
    }

    //TODO move to filters_manager?
    var itemPropertyGetters = {
        Condition: function (item) {
            return item.condition.id;
        },
        ListingType: function (item) {
            return item.listingType;
        },
        Category: function (item) {
            return item.category.id;
        }
    };

    function getItemAspectByFilter(aspectName) {
        return function (item) {
            var aspect = item.aspects[aspectName] || {};
            return aspect.value;
        }
    }

    return module;
}());