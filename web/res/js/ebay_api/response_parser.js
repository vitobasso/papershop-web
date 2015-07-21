/**
 * Created by Victor on 05/07/2015.
 */

function EbayResponseParser() {

    var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");

    this.parseFind = function (response) {
        var responseItems = response.findItemsAdvancedResponse[0].searchResult[0].item || [];
        return responseItems.map(parseFindItem);
    };

    function parseFindItem(item) {
        var listing = item.listingInfo[0];
        var endStr = listing.endTime[0];
        var category = item.primaryCategory[0];
        var price = item.sellingStatus[0].currentPrice[0];
        return {
            id: item.itemId[0],
            title: item.title[0],
            category: {
                id: +category.categoryId[0],
                name: category.categoryName[0]
            },
            aspects: {},
            condition: parseCondition(item),
            listingType: listing.listingType[0],
            end: dateFormat.parse(endStr),
            price: {
                currency: price["@currencyId"],
                value: +price.__value__
            },
            country: item.country[0],
            image: item.galleryURL[0],
            link: item.viewItemURL[0]
        }
    }

    function parseCondition(item) {
        var result = {};
        if (item.condition && item.condition[0]) {
            var condition = item.condition[0];
            if (condition) {
                result = {
                    id: +condition.conditionId[0],
                    name: condition.conditionDisplayName[0]
                }
            }
        }
        return result;
    }

    this.parseHistograms = function (response) {
        var aspects = response.getHistogramsResponse[0].aspectHistogramContainer[0].aspect;
        return aspects.map(function (aspect) {
            return {
                name: aspect['@name'],
                values: aspect.valueHistogram.map(function (histogram) {
                    return {
                        name: histogram['@valueName'],
                        count: histogram.count[0]
                    }
                })
            }
        });
    };

}
