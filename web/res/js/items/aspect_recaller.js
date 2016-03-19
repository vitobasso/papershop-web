var AspectRecaller = (function () {
    var module = {};

    module.rememberFromRequest = function (requestParams, newItems) {
        var valueByAspectId = getAspectsFromRequest(requestParams);
        newItems.forEach(item => {
            _.keys(valueByAspectId).forEach(aspectId => {
                var value = valueByAspectId[aspectId];
                item.aspects[aspectId] = copyValue(value);
            })
        });
    };

    function copyValue(value){
        return {
            id: value.id,
            name: value.name,
            confidence: 2
        }
    }

    function getAspectsFromRequest(requestParams) {
        var singleValueAspects = requestParams.filters.filter(aspect => aspect.selected.length == 1);
        var valueByAspectId = {};
        singleValueAspects.forEach(aspect => {
            var aspectId = aspect.filter.id;
            valueByAspectId[aspectId] = aspect.selected[0];
        });
        return valueByAspectId;
    }

    return module;
}());