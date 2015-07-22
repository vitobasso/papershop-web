/**
 * Created by Victor on 30/06/2015.
 */

function EbayApi() {

    var urlBuilder = new EbayUrlBuilder();
    var parser = new EbayResponseParser();

    this.find = function (params, onSuccess, onFail) {
        var url = urlBuilder.buildFindUrl(params);
        try {
            requestAndParse(url, parser.parseFind, onSuccess, onFail)
        } catch (err) {
            onFail(err);
        }
    };

    this.histograms = function (params, onSuccess, onFail) {
        var url = urlBuilder.buildHistogramsUrl(params);
        requestAndParse(url, parser.parseHistograms, onSuccess, onFail);
    };

    function requestAndParse(url, parse, onSuccess, onFail) {
        request(url, parseAndCallback, onFail);

        function parseAndCallback(response) {
            try {
                var result = parse(response);
                onSuccess(result);
            } catch (err) {
                onFail(err);
            }
        }
    }

    function request(url, onSuccess, onFail) {
        console.log(url);
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: onSuccess,
            error: onFail
        })
    }

}

EbayApi.dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");

EbayApi.dateToString = function (date) {
    return EbayApi.dateFormat(toUTC(date))
};

EbayApi.stringToDate = function (string) {
    return toLocal(EbayApi.dateFormat.parse(string));
};