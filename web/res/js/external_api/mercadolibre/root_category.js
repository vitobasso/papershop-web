
var MLRootCategory = (function () {
    var module = {};

    module.get = () => ({
            aspects: aspects
        });

    var aspects = RootCategoryCommon.fillIds([
        {
            id: "condition",
            name: "Condition",
            values: [
                {id: "new", name: "New"},
                {id: "used", name: "Used"}
            ],
            getFromItem: item => item.condition
        },
        {
            id: "buying_mode",
            name: "Buying Mode",
            values: [
                {id: "buy_it_now", name: "Buy it now"},
                {id: "auction", name: "Auction"}
            ],
            getFromItem: item => item.listingType //TODO change to buyingMode (ml name) ?
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