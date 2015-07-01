/**
 * Created by Victor on 30/06/2015.
 */

function Ebay() {

    var ebayUrl = "http://svcs.ebay.com/services/search/FindingService/v1?" +
        "OPERATION-NAME=findItemsAdvanced" +
        "&SERVICE-VERSION=1.0.0" +
        "&SECURITY-APPNAME=VictorBa-91f0-4b04-b497-3a5e426e0ece" +
        "&RESPONSE-DATA-FORMAT=json" +
        "&keywords=hdd" +
        "&itemFilter(0).name=ListingType" +
        "&itemFilter(0).value(0)=AuctionWithBIN" +
        "&itemFilter(0).value(1)=FixedPrice" +
        "&aspectFilter(0).aspectName=Storage+Capacity" +
        "&aspectFilter(0).aspectValueName(0)=1-3.9TB" +
        "&aspectFilter(0).aspectValueName(1)=4-8TB";

    this.call = function(callback){
        $.ajax({
            url: ebayUrl,
            dataType: "jsonp",
            success: callback
        });
    }

}