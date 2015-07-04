/**
 * Created by Victor on 30/06/2015.
 */

function Ebay() {

    function buildFindUrl(params) {
        return "http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=findItemsAdvanced" +
            "&SERVICE-VERSION=1.0.0" +
            "&SECURITY-APPNAME=VictorBa-91f0-4b04-b497-3a5e426e0ece" +
            "&RESPONSE-DATA-FORMAT=json" +
            "&keywords=" + params.keywords +
            "&itemFilter(0).name=ListingType" +
            "&itemFilter(0).value(0)=AuctionWithBIN" +
            "&itemFilter(0).value(1)=FixedPrice" +
            "&paginationInput.pageNumber=" + params.page +
            buildAspectFilterParams(params.aspects);
    }

    function buildAspectFilterParams(filters) {
        var result = "";
        if (filters) {
            filters.forEach(function (filter, i) {
                result += "&aspectFilter(" + i + ").aspectName=" + filter.name;
                filter.values.forEach(function (value, j) {
                    result += "&aspectFilter(" + i + ").aspectValueName(" + j + ")=" + value;
                });
            });
        }
        return result;
    }

    function buildHistogramsUrl(params) {
        return "http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=getHistograms" +
            "&SERVICE-VERSION=1.0.0" +
            "&SECURITY-APPNAME=VictorBa-91f0-4b04-b497-3a5e426e0ece" +
            "&RESPONSE-DATA-FORMAT=json" +
            "&categoryId=" + params.categoryId
    }

    this.find = function (params, callback) {
        $.ajax({
            url: buildFindUrl(params),
            dataType: "jsonp",
            success: callback,
            error: handleError
        });
    };

    this.histograms = function (params, callback) {
        $.ajax({
            url: buildHistogramsUrl(params),
            dataType: "jsonp",
            success: callback,
            error: handleError
        });
    };

    function handleError(xhr, msg, err) {
        showError(msg);
        throw err;
    }

}