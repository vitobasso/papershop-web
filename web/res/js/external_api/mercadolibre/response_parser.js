
function MLResponseParser() {

    this.parseFind = function (response) {
        if (checkSuccess(response)) {
            var content = response[2];
            var responseItems = content.results || [];
            if(!responseItems.length) throw "Returned zero items";
            return {
                items: responseItems.map(parseFindItem),
                metadata: parseMetadata(content)
            };
        }
    };

    function parseMetadata(response) {
        return {
            totalItems: +response.paging.total,
            itemsReturned: +response.paging.limit
        }
    }

    function checkSuccess(response) {
        var status = response[0];
        if(!status) throw "No status code in response";
        if(status/100 != 2) throw "Failed with status=" + status;
        var resp = response[2];
        if(!resp) throw "Empty response";
        //TODO handle error messages
        return true;
    }

    function parseFindItem(item) {
        return {
            id: item.id,
            title: item.title,
            category: {
                id: item.category_id,
                name: null //TODO
            },
            aspects: {},
            condition: {
                id: item.condition,
                name: null //TODO
            },
            listingType: item.buying_mode,
            end: MLApi.stringToDate(item.stop_time),
            price: {
                currency: item.currency_id,
                value: item.price
            },
            site: item.site_id,
            country: null, //TODO
            shipTo: null, //TODO
            image: item.thumbnail,
            link: item.permalink
        }
    }

}
