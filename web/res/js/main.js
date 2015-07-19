/**
 * Created by Victor on 01/07/2015.
 */
function Main() {

    var allItems = new Set(getId);
    var itemCount = new ItemCountUI();
    var ebayChart = new EbayChart();
    var input = new UIParamsInput();
    var itemFinder = new ItemFinder(updateChart);

    function addItems(newItems) {
        allItems.addMergeAll(newItems, mergeItems);
        itemCount.setTotal(allItems.size());
    }

    function mergeItems(oldItem, newItem) {
        for (var key in  newItem.aspects) {
            if (newItem.aspects.hasOwnProperty(key)) {
                oldItem.aspects[key] = newItem.aspects[key];
            }
        }
    }

    /////////////////////////////////////////////////////////

    $("#request-button").on("click", itemFinder.find);

    $("#keywords, #items-per-page, #page").keyup(function (e) {
        if (e.keyCode == 13) {
            $("#request-button").click();
        }
    });


    /////////////////////////////////////////////////////////

    this.applyFilters = function () {
        var items = filterItems();
        itemCount.setFiltered(items.length);
        ebayChart.setData(items);
    };

    function updateChart(requestParams, newItems) {
        guessAspectsFromTitle(newItems);
        rememberAspectsFromRequest(requestParams, newItems);
        addItems(newItems);
        var items = filterItems();
        itemCount.setFiltered(items.length);
        ebayChart.update(items);
        addFilterOptionDbClickListener();
    }

    function filterItems() {
        var params = input.getParams();
        var filterFunction = new ItemFilter(params).filter;
        return allItems.filter(filterFunction);
    }

    function addFilterOptionDbClickListener() {
        $("#filters").find("div.filter option").dblclick(itemFinder.find);
    }

    ////////////////////////////////////////////////////////////

    function guessAspectsFromTitle(newItems) {
        newItems.forEach(function (item) {
            var category = ebayChart.getCategory(item.category);
            if (category && category.fuzzyValues) {
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
