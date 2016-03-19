var AspectRecaller = (function () {
    var module = {};

    module.rememberFromRequest = function (requestParams, newItems) {
        var aspectsMap = getAspectsFromRequest(requestParams);
        newItems.forEach(item => {
            _.keys(aspectsMap).forEach(aspectId => {
                var aspect = aspectsMap[aspectId];
                item.aspects[aspectId] = {
                    id: aspect.id,
                    name: aspect.name,
                    confidence: 2
                }
            })
        });
    };

    function getAspectsFromRequest(requestParams) {
        var singleValueAspects = requestParams.filters.filter(aspect => aspect.selected.length == 1);
        var aspectsMap = {};
        singleValueAspects.forEach(aspect => {
            var aspectId = aspect.filter.id;
            aspectsMap[aspectId] = aspect.selected[0];
        });
        return aspectsMap;
    }

    return module;
}());