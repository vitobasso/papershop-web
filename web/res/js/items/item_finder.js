var ItemFinder = (function () {
    var module = {};

    module.find = function () {
        var uiParams = UIParamsInput.getParams();
        if (uiParams.keywords) {
            try {
                var params = RequestLog.notifyNewRequestAndGetPaging(uiParams); //TODO publish & paging
                checkTotalItems(params);
                Sources.get().api.find(params);
            } catch (err) {
                onFail(err);
            }
        }//TODO message when keywords empty?
    };

    function publishAspects(result) {
        var aspects = collectAspects(result);
        $.publish('new-aspects', [aspects]);
    }

    function collectAspects(result) {
        let collectedSet = result.items.reduce(
            (acc, item) => {
                let aspects = itemAspects(item);
                acc.addMergeAll(aspects, Merge.mergeObjects);
                return acc;
            }, new Set(getName));
        return collectedSet.toArray();
    }

    function itemAspects(item) {
        function toAspect(key) {
            let getValue = (anyItem) => ({
                id: anyItem[key],
                name: anyItem[key]
            })
            return {
                 id: key,
                 name: key,
                 values: [getValue(item)],
                 getFromItem: getValue
            }
        }
        return Object.keys(item).map(toAspect)
    }

    function checkTotalItems(params) {
        if(params.lastItem && params.totalItems
            && params.lastItem >= params.totalItems) {
            throw "No new items left for this set of filters";
        }
    }

    module.onSuccess = (params, result) => {
        publishAspects(result);
        $.publish('find-items', [params, result]);
    }

    return module;
}());