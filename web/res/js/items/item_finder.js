var ItemFinder = (function () {
    var module = {};

    module.find = function () {
        var uiParams = UIParamsInput.getParams();
        if (uiParams.keywords) {
            try {
                var params = RequestLog.notifyNewRequestAndGetPaging(uiParams); //TODO publish & paging
                checkTotalItems(params);
                Sites.get().api.find(params, onSuccess, onFail);
            } catch (err) {
                onFail(err);
            }
        }//TODO message when keywords empty?


        function onSuccess(result) {
            publishAspects(result);
            $.publish('find-items', [params, result]);
        }

        function onFail(err) {
            console.log("Find failed:");
            console.log(err);
            $.publish('find-items-failed', params);
        }

    };

    function publishAspects(result) {
        if (result.category) { //only ml has aspects in the return of item-find TODO publish from inside the specific api?
            $.publish('new-aspects', [result.category, result.category.aspects]);
        }
    }

    function checkTotalItems(params) {
        if(params.lastItem && params.totalItems
            && params.lastItem >= params.totalItems) {
            throw "No new items left for this set of filters";
        }
    }

    return module;
}());