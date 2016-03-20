
var EbayRootCategory = (function () {
    var module = {};

    module.get = () => ({
            aspects: aspects
        });

    var aspects = RootCategoryCommon.fillIds([
        {
            name: "Condition",
            values: [
                {id: 1000, name: "New"},
                {id: 1500, name: "New other (see details)"},
                {id: 1750, name: "New with defects"},
                {id: 2000, name: "Manufacturer refurbished"},
                {id: 2500, name: "Seller refurbished"},
                {id: 3000, name: "Used"},
                {id: 4000, name: "Very Good"},
                {id: 5000, name: "Good"},
                {id: 6000, name: "Acceptable"},
                {id: 7000, name: "For parts or not working"}
            ],
            getFromItem: item => item.condition
        },
        {
            name: "ListingType",
            values: [
                {name: "Auction"},
                {name: "AuctionWithBIN"},
                {name: "Classified"},
                {name: "FixedPrice"},
                {name: "StoreInventory"}
            ],
            getFromItem: item => item.listingType
        },
        RootCategoryCommon.createEndAspect(buildEndUrlParam)
    ]);

    function buildEndUrlParam(param, itemFilterIndex) {
        var i = itemFilterIndex;
        var result = "";
        if (param && param.selected.length) {
            var selected = param.selected[0];
            var now = new Date();
            var toDate = selected.getTime(now);
            var dateStr = EbayApi.dateToString(toDate);
            result += buildItemFilterUrlParam(i, "EndTimeTo", dateStr);
        }
        return result;
    }

    function buildItemFilterUrlParam(i, name, value) {
        return "&itemFilter(" + i + ").name=" + name
            + "&itemFilter(" + i + ").value(0)=" + value;
    }

    return module;
}());