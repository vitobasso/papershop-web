/**
 * Created by Victor on 10/07/2015.
 */
var Filters = (function() {
    var module = {};

    var filters = [
        {
            name: "Condition",
            values: [
                {id: 1000, name: "New"},
                {id: 1500, name: "New other (see details)"},
                {id: 1750, name: "New with defects"},
                {id: 2000, name: "Manufacturer refurbished"},
                {id: 2500, name: "Seller refurbished"},
                {id: 3000, name: "Used"},
                {id: 4000, name: "Very Good"},
                {id: 5000, name: "Good"},
                {id: 6000, name: "Acceptable"},
                {id: 7000, name: "For parts or not working"}
            ],
            getValueLabel: getName,
            getValueId: getId
        },
        {
            name: "ListingType",
            values: [
                "Auction",
                "AuctionWithBIN",
                "Classified",
                "FixedPrice",
                "StoreInventory"
            ],
            getValueLabel: identity,
            getValueId: identity
        },
        {
            name: "End",
            values: [
                {id: 1, name: "In 15 minutes"},
                {id: 2, name: "In 1 hour"},
                {id: 3, name: "In 4 hours"},
                {id: 4, name: "In 12 hours"},
                {id: 5, name: "Today"},
                {id: 6, name: "In 2 days"},
                {id: 7, name: "In 7 days"},
                {id: 8, name: "In 15 days"}
            ],
            getValueLabel: getName,
            getValueId: getId,
            satisfies: endSatisfies
        }
    ];

    module.populate = function () {
        FilterUI.populate(filters)
            .classed("common-filter", true);
    };

    var filtersByName;

    module.getFilterByName = function(name) {
        if(!filtersByName) {
            initFiltersByNameMap();
        }
        return filtersByName[name];
    };

    function initFiltersByNameMap() {
        filtersByName = {};
        filters.forEach(function(filter) {
            filtersByName[filter.name] = filter;
        });
    }

    function endSatisfies(item, endFilterInput) {
        var filterValues = endFilterInput.values;
        if(filterValues && filterValues.length > 0) {
            var filterValue = filterValues[0];
            var itemValue = item.end;
            var now = new Date();
            switch(filterValue){
                case 1:
                    return itemValue < addMinutes(now, 15);
                case 2:
                    return itemValue < addHours(now, 1);
                case 3:
                    return itemValue < addHours(now, 4);
                case 4:
                    return itemValue < addHours(now, 12);
                case 5:
                    return getDate(itemValue) == getDate(now);
                case 6:
                    return itemValue < addDays(now, 2);
                case 7:
                    return itemValue < addDays(now, 7);
                case 8:
                    return itemValue < addDays(now, 15);
                default:
                    return true;
            }
        }
    }

    return module;
}());