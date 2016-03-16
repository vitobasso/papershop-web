
function EbayApi() {

    var urlBuilder = new EbayUrlBuilder();
    var parser = new EbayResponseParser();

    this.find = function (params, onSuccess, onFail) {
        var url = urlBuilder.buildFindUrl(params);
        ApiCommon.requestAndParse(url, parser.parseFind, onSuccess, onFail);
    };

    this.findAspects = function (params, onSuccess, onFail) {
        var url = urlBuilder.buildHistogramsUrl(params);
        ApiCommon.requestAndParse(url, parser.parseHistograms, onSuccess, onFail);
    };

}

EbayApi.dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");

EbayApi.dateToString = function (date) {
    return EbayApi.dateFormat(toUTC(date))
};

EbayApi.stringToDate = function (string) {
    return toLocal(EbayApi.dateFormat.parse(string));
};