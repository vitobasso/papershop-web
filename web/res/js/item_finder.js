/**
 * Created by Victor on 19/07/2015.
 */
var ItemFinder = (function () {
    var module = {};

    var api;

    module.init = function () {
        api = new EbayApi();
    };

    module.find = function () {
        var uiParams = UIParamsInput.getParams();
        if (uiParams.keywords) {
            var params = RequestLog.notifyNewRequestAndGetPaging(uiParams);
            api.find(params, function(response) {
                Main.updateChart(params, response);
                RequestLog.notifyRequestSuccessful(params);
            });
        }//TODO message when keywords empty?
    };

    return module;
}());