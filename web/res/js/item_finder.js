var ItemFinder = (function () {
    var module = {};

    module.find = function () {
        var uiParams = UIParamsInput.getParams();
        if (uiParams.keywords) {
            try {
                var params = RequestLog.notifyNewRequestAndGetPaging(uiParams); //TODO publish & paging
                checkTotalItems(params);
                Sites.getSelected().find(params, onSuccess, onFail);
            } catch (err) {
                onFail(err);
            }
        }//TODO message when keywords empty?


        function onSuccess(result) {
            $.publish('find-items', [params, result]);
        }

        function onFail(err) {
            console.log("Find failed:");
            console.log(err);
            $.publish('failed.find-items', params);
        }

    };

    function checkTotalItems(params) {
        if(params.lastItem && params.totalItems
            && params.lastItem >= params.totalItems) {
            throw "No new items left for this set of filters";
        }
    }

    return module;
}());