/**
 * Created by Victor on 05/07/2015.
 */

function EbayUrlBuilder(){

    var APPID = "VictorBa-91f0-4b04-b497-3a5e426e0ece";

    this.buildFindUrl = function (params) {
        return "http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=findItemsAdvanced" +
            "&SERVICE-VERSION=1.0.0" +
            "&SECURITY-APPNAME=" + APPID +
            "&RESPONSE-DATA-FORMAT=json" +
            "&keywords=" + params.keywords +
            buildCategory(params.category) +
            buildItemFilter("ListingType", params.listingType, 0) +
            buildItemFilter("Condition", params.condition, 0) +
            buildItemFilter("FreeShippingOnly", params.freeShipping, 0) +
            buildItemFilter("LocatedIn", params.locatedIn, 0) +
            buildItemFilter("Seller", params.seller, 0) +
            buildAspectFilter(params.aspects) +
            "&paginationInput.pageNumber=" + params.page;
    };

    function buildCategory(categoryId) {
        var result = "";
        if (categoryId) {
            result = "&categoryId=" + categoryId;
        }
        return result;
    }

    function buildItemFilter(name, values, i) {
        var result = "";
        if (values) {
            result = "&itemFilter(" + i + ").name=" + name;
            values.forEach(function (value, j) {
                result += "&itemFilter(" + i + ").value(" + j + ")=" + value;
            });
        }
        return result;
    }

    function buildAspectFilter(filters) {
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


    this.buildSpecificsUrl = function (itemIds) {
        return "http://open.api.ebay.com/shopping?" +
            "callname=GetMultipleItems" +
            "&version=515" +
            "&responseencoding=JSON" +
            "&appid=" + APPID +
            "&ItemID=" + itemIds.join(",") +
            "&IncludeSelector=ItemSpecifics"
    };

    this.buildHistogramsUrl = function (params) {
        return "http://svcs.ebay.com/services/search/FindingService/v1?" +
            "OPERATION-NAME=getHistograms" +
            "&SERVICE-VERSION=1.0.0" +
            "&SECURITY-APPNAME=" + APPID +
            "&RESPONSE-DATA-FORMAT=json" +
            "&categoryId=" + params.categoryId
    };

}