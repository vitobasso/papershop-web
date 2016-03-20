var RootCategoryCommon = (function () {
    var module = {};

    module.fillIds = function (aspects) {
        return aspects.map((aspect) => {
            var result = copyNameToId(aspect);
            result.values = result.values.map(copyNameToId);
            return result;
        });
    };

    function copyNameToId(obj) {
        if (!obj.id) {
            obj.id = obj.name;
        }
        return obj;
    }

    module.endAspect = {
        name: "End",
        values: [
            {name: "In 1 hour", getTime: timeCalc(addHours, 1)},
            {name: "In 1 day", getTime: timeCalc(addDays, 1)},
            {name: "In 30 days", getTime: timeCalc(addDays, 30)}
        ],
        axis: "Time",
        getFromItem: item => item.end,
        satisfies: satisfiesEnd
    };

    function satisfiesEnd(item, param) {
        if (param && param.selected.length) {
            var selected = param.selected[0];
            var now = new Date();
            var limit = selected.getTime(now);
            return item.end <= limit;
        }
    }

    function timeCalc(addTime, amount) {
        return now => addTime(now, amount);
    }

    module.getTimeValueForSelection = function (param) {
        if (param && param.selected.length) {
            var selected = param.selected[0];
            var now = new Date();
            return selected.getTime(now);
        }
    };

    return module;
}());