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

    module.onSuccess = (params, result) => {
        var aspects = collectAspects(result);
        $.publish('new-aspects', [aspects]);
        $.publish('find-items', [params, result]);
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
        return Object.keys(item).filter(isNotDiscardedAspect).map(toAspect)
    }

    function isNotDiscardedAspect(name) { //TODO do it based on values analysis instead
        let discardedAspects = ['category', 'aspects', 'id', 'name', 'title', 'price', 'image', 'link']; //TODO remove category project-wide
        return discardedAspects.indexOf(name) < 0;
    }

    function checkTotalItems(params) {
        if(params.lastItem && params.totalItems
            && params.lastItem >= params.totalItems) {
            throw "No new items left for this set of filters";
        }
    }

    return module;
}());