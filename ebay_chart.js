/**
 * Created by Victor on 01/07/2015.
 */
function EbayChart() {

    var x = {
        label: "Listing Time",
        scale: d3.time.scale,
        fun: function (d) {
            return d.listingTime;
        }
    };
    var y = {
        label: "Current Price (USD)",
        scale: d3.scale.linear,
        fun: function (d) {
            return d.price;
        }
    };
    var chart = new Chart(x, y);

    var items = [];
    var currentPage = 0;

    var ebay = new Ebay();

    var categories = new Categories(ebay);

    this.requestNextPage = function () {
        currentPage = currentPage + 1;
        var keywords = $("input[title=keywords]").val();
        var params = {
            keywords: keywords,
            page: currentPage
        };
        ebay.find(params, populateChart);
    };

    function populateChart(response) {
        var newItems = parseFindResponse(response);
        items = items.concat(newItems);
        categories.addFromItens(items);
        chart.populate(items);
    }

    function parseFindResponse(response) {
        var items = response.findItemsAdvancedResponse[0].searchResult[0].item || [];
        return items.map(parseItem);
    }

    function parseItem(item) {
        var dateStr = item.listingInfo[0].startTime[0];
        var category = item.primaryCategory[0];
        return {
            id: item.itemId[0],
            category: {
                id: category.categoryId[0],
                name: category.categoryName[0]
            },
            listingTime: dateFormat.parse(dateStr),
            price: +item.sellingStatus[0].currentPrice[0].__value__
        }
    }

    var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");

}
