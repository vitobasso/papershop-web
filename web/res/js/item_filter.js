/**
 * Created by Victor on 11/07/2015.
 */
function ItemFilter(params) {

    this.filter = filterItem;

    function filterItem(item) {
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

    function satisfiesFilter(item, filter) {
        if (filter.values.length == 0) {
            return true;
        }
        var getProperty = itemPropertyIdGetter(filter.name);
        var property = getProperty(item);
        return filter.values.contains(property);
    }

    function itemPropertyIdGetter(propertyName) {
        return itemPropertyGetters[propertyName]
            || getItemAspectByFilter(propertyName);
    }

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

}