/**
 * Created by Victor on 01/07/2015.
 */
function EbayChart() {

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
            return item.price;
        }
    };
    var chart = new Chart(x, y);




    var items = new Set(getId);
    var currentPage = 0;

    function addItems(newItems){
        items.addAll(newItems);
        $("#total-count").show().text(items.size());
    }

    function getId(item){
        return item.id;
    }



    var ebay = new Ebay();

    var categories = new Categories(ebay);

    this.requestNextPage = function () {
        currentPage = currentPage + 1;
        var keywords = $("input[title=keywords]").val();
        var params = {
            keywords: keywords,
            page: currentPage,
            aspects: getAspectFilters()
        };
        ebay.find(params, populateChart);
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

    function populateChart(response) {
        var newItems = parseFindResponse(response);
        addItems(newItems);
        var itemsArray = items.toArray();
        categories.addFromItens(itemsArray);
        chart.populate(itemsArray);
    }

    function parseFindResponse(response) {
        var responseItems = response.findItemsAdvancedResponse[0].searchResult[0].item || [];
        return responseItems.map(parseItem);
    }

    function parseItem(item) {
        var dateStr = item.listingInfo[0].startTime[0];
        var category = item.primaryCategory[0];
        return {
            id: item.itemId[0],
            title: item.title[0],
            category: {
                id: category.categoryId[0],
                name: category.categoryName[0]
            },
            listingTime: dateFormat.parse(dateStr),
            price: +item.sellingStatus[0].currentPrice[0].__value__,
            image: item.galleryURL[0],
            link: item.viewItemURL[0]
        }
    }

    var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");

}
