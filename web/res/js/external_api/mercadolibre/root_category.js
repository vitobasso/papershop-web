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
        RootCategoryCommon.endAspect
    ]);

    return module;
}());