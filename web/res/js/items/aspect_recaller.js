var AspectRecaller = (function () {
    var module = {};

    module.rememberFromRequest = function (requestParams, newItems) {
        var aspectsMap = getAspectsFromRequest(requestParams);
        newItems.forEach(item => {
            _.keys(aspectsMap).forEach(aspectName => {
                item.aspects[aspectName] = {
                    value: aspectsMap[aspectName],
                    confidence: 2
                }
            })
        });
    };

    function getAspectsFromRequest(requestParams) {
        var singleValueAspects = requestParams.filters.filter(aspect => aspect.selected.length == 1);
        var aspectsMap = {};
        singleValueAspects.forEach(function (aspect) {
            var name = aspect.filter.name;
            aspectsMap[name] = aspect.selected[0].name;
        });
        return aspectsMap;
    }

    return module;
}());