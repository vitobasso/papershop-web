
function MLApi() {

    var urlBuilder = new MLUrlBuilder();
    var parser = new MLResponseParser();

    this.find = function (params, onSuccess, onFail) {
        var url = urlBuilder.buildFindUrl(params);
        ApiCommon.requestAndParse(url, parser.parseFind, onSuccess, onFail);
    };

    this.findAspects = function (params, onSuccess, onFail) {
        //TODO remove
    };

}

MLApi.dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");

MLApi.dateToString = function (date) {
    return MLApi.dateFormat(toUTC(date))
};

MLApi.stringToDate = function (string) {
    return toLocal(MLApi.dateFormat.parse(string));
};