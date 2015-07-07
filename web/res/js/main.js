/**
 * Created by Victor on 01/07/2015.
 */
function Main() {

    var items = new Set(getId);
    var api = new EbayApi();
    var ebayChart = new EbayChart(api, getItems, "#x-axis-select");

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
        rememberAspects(requestParams, newItems); //TODO move to parser? api?
        addItems(newItems);
        //fetchItemAspects(newItems);
        var itemsArray = items.toArray();
        ebayChart.populate(itemsArray);
    }

    function rememberAspects(requestParams, newItems) {
        var requestAspects = getAspectsFromRequest(requestParams);
        newItems.forEach(function (item) {
            item.aspects = requestAspects;
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

    function mergeAspects(oldItem, newItem) {
        for (var key in  oldItem.aspects) {
            if (oldItem.aspects.hasOwnProperty(key)) {
                oldItem.aspects[key] = newItem.aspects[key];
            }
        }
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

    function getName(object) {
        return object.name;
    }

}

function showError(msg) {
    $("#error-msg").html(msg);
}
