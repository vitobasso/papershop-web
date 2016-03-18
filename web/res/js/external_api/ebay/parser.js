
function EbayResponseParser() {

    this.parseFind = function (response) {
        if (checkSuccess(response)) {
            var content = response.findItemsAdvancedResponse[0];
            var responseItems = content.searchResult[0].item || [];
            if(!responseItems.length) throw "Returned zero items";
            return {
                items: responseItems.map(parseFindItem),
                metadata: parseMetadata(content)
            };
        }
    };

    function parseMetadata(response) {
        return {
            totalItems: +response.paginationOutput[0].totalEntries[0],
            itemsReturned: +response.searchResult[0]["@count"]
        }
    }

    function checkSuccess(response) {
        var resp = response.findItemsAdvancedResponse[0];
        if(!resp) throw "No response";
        var ack = resp.ack[0];
        if(ack != "Success") throw "Error response: " + resp.errorMessage[0].error[0].message[0];
        return true;
    }

    function parseFindItem(item) {
        var listing = item.listingInfo[0];
        var endStr = listing.endTime[0];
        var category = item.primaryCategory[0];
        var price = item.sellingStatus[0].currentPrice[0];
        var shipTo = item.shippingInfo[0].shipToLocations[0]; //TODO multiple locations
        return {
            id: item.itemId[0],
            title: item.title[0],
            category: {
                id: +category.categoryId[0],
                name: category.categoryName[0]
            },
            aspects: {},
            condition: parseCondition(item.condition[0]),
            listingType: parseListingType(listing.listingType[0]),
            end: EbayApi.stringToDate(endStr),
            price: {
                currency: price["@currencyId"],
                value: +price.__value__
            },
            site: item.globalId[0],
            country: item.country[0],
            shipTo: shipTo,
            image: item.galleryURL[0],
            link: item.viewItemURL[0]
        }
    }

    function parseCondition(condition) {
        if (condition) {
            return {
                id: +condition.conditionId[0],
                name: condition.conditionDisplayName[0]
            }
        }
    }

    function parseListingType(listingType) {
        return {
            id: listingType,
            name: listingType
        }
    }

    this.parseHistograms = function (response) {
        var aspects = response.getHistogramsResponse[0].aspectHistogramContainer[0].aspect;
        return aspects.map(parseAspect);
    };

    function parseAspect(aspect) {
        var aspectName = aspect['@name'];
        return {
            id: aspectName,
            name: aspectName,
            values: aspect.valueHistogram.map(parseValue)
        }
    }

    function parseValue(histogram){
        var valueName = histogram['@valueName'];
        return {
            id: valueName,
            name: valueName
        }
    }

}
