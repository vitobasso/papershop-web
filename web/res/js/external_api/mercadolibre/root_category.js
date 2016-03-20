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

    function buildEndUrlParam(param) {
        var result = "";
        if (param && param.selected.length) {
            var selected = param.selected[0];
            if (["In 1 day", "In 1 hour"].find(equals(selected.id))) {
                result = "&until=today"; //ml's only option for filtering "End"
            }
        }
        return result;
    }

    return module;
}());