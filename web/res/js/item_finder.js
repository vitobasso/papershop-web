/**
 * Created by Victor on 19/07/2015.
 */
function ItemFinder(updateChart) {

    this.find = find;

    var input = new UIParamsInput();
    var api = new EbayApi();
    var requests = new RequestLog("#request-log");

    function find() {
        var params = requests.notifyNewRequestAndGetPaging(input.getParams());
        api.find(params, function (response) {
            updateChart(params, response);
            requests.notifyRequestSuccessful(params);
        });
    }

}