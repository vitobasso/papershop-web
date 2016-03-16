
function MLResponseParser() {

    this.parseFind = function (response) {
        if (checkSuccess(response)) {
            var content = response[2];
            var responseItems = content.results || [];
            if(!responseItems.length) throw "Returned zero items";
            var category = parseFilters(content);
            return {
                items: responseItems.map(parseFindItem(category)),
                metadata: parseMetadata(content),
                category: category
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

    function parseFindItem(category) {
        return item => ({
            id: item.id,
            title: item.title,
            category: {
                id: category.id,
                name: category.name
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
        })
    }

    function parseFilters(content){
        var categoryFilter = content.filters[0];
        if(categoryFilter.id != "category") throw "Expected category filter";
        var categoryValue = categoryFilter.values[0];
        return {
            id: categoryValue.id,
            name: categoryValue.name,
            aspects: content.available_filters.map(parseAspect)
        }
    }

    function parseAspect(filter){
        return {
            id: filter.id,
            name: filter.name,
            values: filter.values.map(parseAspectValue)
        }
    }

    function parseAspectValue(value){
        return {
            id: value.id,
            name: value.name
        }
    }

}
