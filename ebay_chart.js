/**
 * Created by Victor on 01/07/2015.
 */
function EbayChart() {

    var ebay = new Ebay();

    var categories = new Categories(ebay);

    /////////////////////////////////////////////////////////

    var items = new Set(getId);

    function addItems(newItems) {
        items.addAll(newItems);
        $("#total-count").show().text(items.size());
    }

    function getId(item) {
        return item.id;
    }

    /////////////////////////////////////////////////////////

    this.doRequest = function () {
        var params = {
            keywords: $("#keywords").val(),
            page: $("#page").val(),
            aspects: getAspectFilters()
        };
        ebay.find(params, tryPopulateChart);
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

    var x = {
        label: "Listing Time",
        scale: d3.time.scale,
        fun: function (item) {
            return item.listingTime;
        }
    };
    var y = {
        label: "Current Price (USD)",
        scale: d3.scale.linear,
        fun: function (item) {
            return item.price.value;
        }
    };
    var chart = new Chart(x, y);

    function tryPopulateChart(response) {
        try {
            populateChart(response);
        } catch (err) {
            showError(err);
            throw err;
        }
    }

    function populateChart(response) {
        var newItems = parseFindResponse(response);
        addItems(newItems);
        var itemsArray = items.toArray();
        categories.populate(itemsArray);
        chart.populate(itemsArray);
    }

    /////////////////////////////////////////////////////////

    function parseFindResponse(response) {
        var responseItems = response.findItemsAdvancedResponse[0].searchResult[0].item || [];
        return responseItems.map(parseItem);
    }

    function parseItem(item) {
        var dateStr = item.listingInfo[0].startTime[0];
        var category = item.primaryCategory[0];
        var price = item.sellingStatus[0].currentPrice[0];
        return {
            id: item.itemId[0],
            title: item.title[0],
            category: {
                id: category.categoryId[0],
                name: category.categoryName[0]
            },
            condition: parseCondition(item),
            listingTime: dateFormat.parse(dateStr),
            price: {
                currency: price["@currencyId"],
                value: +price.__value__
            },
            country: item.country[0],
            image: item.galleryURL[0],
            link: item.viewItemURL[0]
        }
    }

    function parseCondition(item) {
        var result = {};
        if (item.condition && item.condition[0]) {
            var condition = item.condition[0];
            if (condition) {
                result = {
                    id: condition.conditionId[0],
                    name: condition.conditionDisplayName[0]
                }
            }
        }
        return result;
    }
}

var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");

///////////////////////////////////////////////////////////

function showError(msg) {
    $("#error-msg").html(msg);
}
