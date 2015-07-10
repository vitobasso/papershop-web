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
            listingType: ["AuctionWithBIN", "FixedPrice"],
            aspects: getAspectFilters(),
            itemsPerPage: $("#items-per-page").val(),
            page: $("#page").val()
        };
    }

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
            return satisfiesAspects(item, params.aspects);
        };
    }

    function satisfiesAspects(item, aspectFilters) {
        for (var i = 0, aspectFilter; aspectFilter = aspectFilters[i]; i++) {
            if (!satisfiesAspect(item, aspectFilter)) {
                return false;
            }
        }
        return true;
    }

    function satisfiesAspect(item, aspectFilter) {
        var itemAspect = item.aspects[aspectFilter.name] || {};
        return aspectFilter.values.length == 0 ||
            aspectFilter.values.contains(itemAspect.value);
    }

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
