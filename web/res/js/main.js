/**
 * Created by Victor on 01/07/2015.
 */
function Main() {

    var items = new Set(getId);
    var api = new EbayApi();
    var ebayChart = new EbayChart(api, getItems, "#x-axis-select", "#color-select");

    function getItems() {
        return items.toArray();
    }

    function mergeItems(oldItem, newItem) {
        for (var key in  newItem.aspects) {
            if (newItem.aspects.hasOwnProperty(key)) {
                oldItem.aspects[key] = newItem.aspects[key];
            }
        }
    }

    function addItems(newItems) {
        items.addMergeAll(newItems, mergeItems);
        $("#total-count").show().text(items.size());
    }

    /////////////////////////////////////////////////////////

    this.doRequest = function () {
        var params = {
            keywords: $("#keywords").val(),
            listingType: ["AuctionWithBIN", "FixedPrice"],
            aspects: getAspectFilters(),
            itemsPerPage: $("#items-per-page").val(),
            page: $("#page").val()

        };

        api.find(params, function (response) {
            populateChart(params, response)
        });
    };

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

    function populateChart(requestParams, newItems) {
        guessAspectsFromTitle(newItems);
        rememberAspectsFromRequest(requestParams, newItems);
        addItems(newItems);
        ebayChart.populate(items.toArray());
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
