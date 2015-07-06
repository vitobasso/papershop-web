/**
 * Created by Victor on 01/07/2015.
 */
function Main() {

    var items = new Set(getId);
    var api = new EbayApi();
    var ebayChart = new EbayChart(getItems, "#x-axis-select");
    var categories = new Categories(api);

    function getId(item) {
        return item.id;
    }

    function getItems() {
        return items.toArray();
    }

    function addItems(newItems) {
        items.addAll(newItems);
        $("#total-count").show().text(items.size());
    }

    /////////////////////////////////////////////////////////

    this.doRequest = function () {
        var params = {
            keywords: $("#keywords").val(),
            listingType: ["AuctionWithBIN", "FixedPrice"],
            aspects: getAspectFilters(),
            page: $("#page").val()

        };
        api.find(params, tryPopulateChart);
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

    function tryPopulateChart(response) {
        try {
            populateChart(response);
        } catch (err) {
            showError(err);
            throw err;
        }
    }

    function populateChart(newItems) {
        addItems(newItems);
        //fetchItemAspects(newItems);
        var itemsArray = items.toArray();
        categories.populate(itemsArray);
        ebayChart.populate(itemsArray);
    }

    function fetchItemAspects(newItems) {
        newItems.map(getId)
            .chunk(20)
            .forEach(fetchAspectsAndMerge);
    }

    function fetchAspectsAndMerge(itemIds) {
        api.itemSpecifics(itemIds, function (aspectsOfEachItem) {
            aspectsOfEachItem.forEach(mergeItemAspects)
        });
    }

    function mergeItemAspects(itemAspects) {
        var item = items.get(itemAspects.id);
        item.aspects = itemAspects.aspects;
    }

    /////////////////////////////////////////////////////////

    var condition = [
        {1000: "New"},
        {1500: "New other (see details)"},
        {1750: "New with defects"},
        {2000: "Manufacturer refurbished"},
        {2500: "Seller refurbished"},
        {3000: "Used"},
        {4000: "Very Good"},
        {5000: "Good"},
        {6000: "Acceptable"},
        {7000: "For parts or not working"}
    ];

    ///////////////////////////////////////////////////////////

    function getId(object) {
        return object.id;
    }

}

function showError(msg) {
    $("#error-msg").html(msg);
}
