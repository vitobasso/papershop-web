/**
 * Created by Victor on 01/07/2015.
 */
function Main() {

    var allItems = new Set(getId);
    var api = new EbayApi();
    var ebayChart = new EbayChart(api, "#x-axis-select", "#color-select");

    function addItems(newItems) {
        allItems.addMergeAll(newItems, mergeItems);
        $("#total-count").show().text(allItems.size());
    }

    function mergeItems(oldItem, newItem) {
        for (var key in  newItem.aspects) {
            if (newItem.aspects.hasOwnProperty(key)) {
                oldItem.aspects[key] = newItem.aspects[key];
            }
        }
    }

    /////////////////////////////////////////////////////////

    this.doRequest = function () {
        var params = getUIParams();
        api.find(params, function (response) {
            updateChart(params, response)
        });
    };

    function getUIParams() {
        return {
            keywords: $("#keywords").val(),
            filters: getFilters(),
            aspects: getAspectFilters(),
            itemsPerPage: $("#items-per-page").val(),
            page: $("#page").val()
        };
    }

    function getFilters() {
        var filters = [];
        $("#filters").find("select").each(function (i, filterNode) {
            var sel = $(filterNode).find("option").filter(":selected");
            if (sel.length > 0) {
                var filterDatum = filterNode.__data__;
                var filter = {
                    name: filterDatum.name,
                    values: sel.toArray().map(function (option) {
                        return filterDatum.getValueId(option.__data__)
                    })
                };
                filters.push(filter);
            }
        });
        return filters;
    }

    //TODO unify with similar code from getFilters()
    function getAspectFilters() {
        var filters = [];
        $("#categories").find("select").each(function (i, aspect) {
            var sel = $(aspect).find("option").filter(":selected");
            if (sel.length > 0) {
                var filter = {
                    name: aspect.__data__.name,
                    values: sel.toArray().map(function (option) {
                        return option.__data__.name
                    })
                };
                filters.push(filter);
            }
        });
        return filters;
    }

    /////////////////////////////////////////////////////////

    this.applyFilters = function () {
        var items = filterItems();
        ebayChart.repopulate(items);
    };

    function updateChart(requestParams, newItems) {
        guessAspectsFromTitle(newItems);
        rememberAspectsFromRequest(requestParams, newItems);
        addItems(newItems);
        var items = filterItems();
        ebayChart.update(items);
    }

    function filterItems() {
        var filterFunction = createItemFilterFunction();
        return allItems.filter(filterFunction);
    }

    function createItemFilterFunction() {
        var params = getUIParams();
        return function (item) {
            return satisfiesFilters(item, params.filters)
                && satisfiesAspectFilters(item, params.aspects);
        };
    }

    function satisfiesFilters(item, filters) {
        for (var i = 0, filter; filter = filters[i]; i++) {
            if (!satisfiesFilter(item, filter)) {
                return false;
            }
        }
        return true;
    }

    function satisfiesAspectFilters(item, filters) {
        for (var i = 0, filter; filter = filters[i]; i++) {
            if (!satisfiesAspectFilter(item, filter)) {
                return false;
            }
        }
        return true;
    }

    function satisfiesFilter(item, filter) {
        if (filter.values.length == 0) {
            return true;
        }
        var getProperty = getItemPropertyByFilter[filter.name];
        var property = getProperty(item);
        return filter.values.contains(property);
    }

    function satisfiesAspectFilter(item, filter) {
        if (filter.values.length == 0) {
            return true;
        }
        var property = item.aspects[filter.name] || {};
        return filter.values.contains(property.value);
    }

    var getItemPropertyByFilter = {
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

    function guessAspectsFromTitle(newItems) {
        newItems.forEach(function (item) {
            var category = ebayChart.getCategory(item.category);
            if (category) {
                guessAspects(item, category);
            }
        });
    }

    function rememberAspectsFromRequest(requestParams, newItems) {
        var requestAspects = getAspectsFromRequest(requestParams);
        newItems.forEach(function (item) {
            for (var aspectName in requestAspects) {
                if (requestAspects.hasOwnProperty(aspectName)) {
                    item.aspects[aspectName] = {
                        value: requestAspects[aspectName],
                        confidence: 2
                    };
                }
            }
        });
    }

    function getAspectsFromRequest(requestParams) {
        var singleValueAspects = requestParams.aspects.filter(function (aspect) {
            return aspect.values.length == 1;
        });
        var aspectsMap = {};
        singleValueAspects.forEach(function (aspect) {
            aspectsMap[aspect.name] = aspect.values[0];
        });
        return aspectsMap;
    }

}

///////////////////////////////////////////////////////////

function showError(msg) {
    $("#error-msg").html(msg);
}
