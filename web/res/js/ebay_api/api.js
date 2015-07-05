/**
 * Created by Victor on 30/06/2015.
 */

function EbayApi() {

    var urlBuilder = new EbayUrlBuilder()
    var parser = new EbayResponseParser();

    this.find = function (params, callback) {
        var url = urlBuilder.buildFindUrl(params);
        requestAndParse(url, parser.parseFind, callback)
    };

    this.itemSpecifics = function (params, callback) {
        var url = urlBuilder.buildFindUrl(params);
        requestAndParse(url, parser.parseSpecifics, callback);
    };

    this.histograms = function (params, callback) {
        var url = urlBuilder.buildHistogramsUrl(params);
        requestAndParse(url, parser.parseHistograms, callback);
    };

    function requestAndParse(url, parse, callback) {
        request(url, function (response) {
            var result = parse(response);
            callback(result);
        });
    }

    function request(url, callback) {
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: callback,
            error: handleError
        })
    }

    function handleError(xhr, msg, err) {
        showError(msg);
        throw err;
    }

}