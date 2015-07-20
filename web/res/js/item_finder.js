/**
 * Created by Victor on 19/07/2015.
 */
var ItemFinder = (function(){
    var module = {};

    var api;

    module.init = function(){
        api = new EbayApi();
    };

    module.find = function() {
        var params = RequestLog.notifyNewRequestAndGetPaging(UIParamsInput.getParams());
        api.find(params, function (response) {
            Main.updateChart(params, response);
            RequestLog.notifyRequestSuccessful(params);
        });
    };

    return module;
}());