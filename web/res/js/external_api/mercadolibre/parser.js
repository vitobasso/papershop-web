
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
            category: parseCategory(category),
            aspects: {},
            condition: findAttributeValue('condition', item.condition),
            listingType: findAttributeValue('buying_mode', item.buying_mode),
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

    function parseCategory(category) {
        return {
            id: category.id,
            name: category.name,
            parent: MLRootCategory.get()
        }
    }

    function findAttributeValue(aspectId, valueId){
        return MLRootCategory.get()
            .aspects.find(hasId(aspectId))
            .values.find(hasId(valueId))
    }

    function parseFilters(content){
        var categoryFilter = content.filters[0];
        if(categoryFilter.id != "category") throw "Expected category filter";
        var categoryValue = categoryFilter.values[0];
        var allFilters = content.available_filters.concat(content.filters);
        return {
            id: categoryValue.id,
            name: categoryValue.name,
            aspects: allFilters
                .map(parseAspect)
                .filter(filterAspect)
        }
    }

    function parseAspect(filter){
        return {
            id: filter.id,
            name: transformAspectName(filter.name),
            values: filter.values.map(parseAspectValue)
        }
    }

    function transformAspectName(name) {
        var index = name.indexOf("filter");
        if (index > 0) {
            return name.substring(0, index);
        } else {
            return name;
        }
    }

    function parseAspectValue(value){
        return {
            id: value.id,
            name: value.name
        }
    }

    function filterAspect(aspect){
        return /\d.*/.test(aspect.id); //begins with number
    }

}
