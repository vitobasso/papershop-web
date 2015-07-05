/**
 * Created by Victor on 01/07/2015.
 */
function Main() {

    var ebay = new Ebay();
    var categories = new Categories(ebay);

    /////////////////////////////////////////////////////////

    var items = new Set(getId);

    function getId(item) {
        return item.id;
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

    var ebayChart = new EbayChart(getItems, "#x-axis-select");

    function getItems(){
        return items.toArray();
    }

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
        var itemsArray = items.toArray();
        categories.populate(itemsArray);
        ebayChart.populate(itemsArray);
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

    function showError(msg) {
        $("#error-msg").html(msg);
    }

}