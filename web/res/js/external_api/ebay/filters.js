
var Filters = (function () {
    var module = {};

    module.init = () => {
        $.subscribe('init', createCommonAspects);
    };

    function createCommonAspects(){
        $.publish('new-aspects', [undefined, aspects])
    }

    var aspects = fillIds([
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
            ]
        },
        {
            name: "ListingType",
            values: [
                {name: "Auction"},
                {name: "AuctionWithBIN"},
                {name: "Classified"},
                {name: "FixedPrice"},
                {name: "StoreInventory"}
            ]
        },
        {
            name: "End",
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