
var MLRootCategory = (function () {
    var module = {};

    module.get = () => ({
            aspects: aspects
        });

    var aspects = fillIds([
        {
            id: "condition",
            name: "Condition",
            values: [
                {id: "new", name: "New"},
                {id: "used", name: "Used"}
            ]
        },
        {
            id: "buying_mode",
            name: "Buying Mode",
            values: [
                {id: "buy_it_now", name: "Buy it now"},
                {id: "auction", name: "Auction"}
            ]
        },
        {
            name: "End", //TODO copied from ebay. changes needed?
            values: [
                {name: "In 10 minutes",  getTime: timeCalc(addMinutes, 15)},
                {name: "In 1 hour",      getTime: timeCalc(addHours, 1)},
                {name: "In 1 day",       getTime: timeCalc(addDays, 1)},
                {name: "In 7 days",      getTime: timeCalc(addDays, 7)},
                {name: "In 30 days",     getTime: timeCalc(addDays, 30)}
            ],
            satisfies: satisfiesEnd,
            buildUrlParam: buildEndUrlParam
        }
    ]);

    //TODO all below is duplicated from ebay

    function fillIds(aspects){
        return aspects.map((aspect) => {
            var result = copyNameToId(aspect);
            result.values = result.values.map(copyNameToId);
            return result;
        });
    }

    function copyNameToId(obj){
        if(!obj.id){
            obj.id = obj.name;
        }
        return obj;
    }

    function satisfiesEnd(item, param) {
        if (param && param.selected.length) {
            var selected = param.selected[0];
            var now = new Date();
            var limit = selected.getTime(now);
            return item.end <= limit;
        }
    }

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

    function timeCalc(fun, secondArg) {
        return function(now){
            return fun(now, secondArg);
        };
    }

    return module;
}());