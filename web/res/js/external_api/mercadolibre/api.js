
function MLApi() {
    //FIXME duplicates EbayApi

    var urlBuilder = new MLUrlBuilder();
    var parser = new MLResponseParser();

    this.find = function (params, onSuccess, onFail) {
        var url = urlBuilder.buildFindUrl(params);
        requestAndParse(url, parser.parseFind, onSuccess, onFail);
    };

    this.histograms = function (params, onSuccess, onFail) {
        //TODO remove
    };

    function requestAndParse(url, parse, onSuccess, onFail) {
        request(url, parseAndCallback, onFail);

        function parseAndCallback(response) {
            try {
                var result = parse(response);
            } catch (err) {
                onFail(err);
                return;
            }
            onSuccess(result);
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

MLApi.dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");

MLApi.dateToString = function (date) {
    return MLApi.dateFormat(toUTC(date))
};

MLApi.stringToDate = function (string) {
    return toLocal(MLApi.dateFormat.parse(string));
};