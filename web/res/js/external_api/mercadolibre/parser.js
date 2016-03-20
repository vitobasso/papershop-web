
function MLResponseParser() {

    this.parseFind = function (response) {
        if (checkSuccess(response)) {
            var content = response[2];
            var responseItems = content.results || [];
            if(!responseItems.length) throw "Returned zero items";
            var optCategory = parseFilters(content); //a category may or may not be found on "filters", therefore "opt" (optional)
            return {
                items: responseItems.map(parseFindItem(optCategory)),
                metadata: parseMetadata(content),
                category: optCategory
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

    function parseFindItem(optCategory) {
        return item => ({
            id: item.id,
            title: item.title,
            category: buildCategory(optCategory, item.category_id),
            aspects: {},
            condition: findAttributeValue('condition', item.condition),
            listingType: findAttributeValue('buying_mode', item.buying_mode), //TODO rename to buyingMode (ML name)?
            end: MLApi.stringToDate(item.stop_time),
            price: {
                currency: item.currency_id,
                value: item.price
            },
            site: item.site_id,
            country: undefined, //TODO
            shipTo: undefined, //TODO
            image: item.thumbnail,
            link: item.permalink
        })
    }

    function buildCategory(optCategory, categoryId) {
        if (optCategory) return {
            id: optCategory.id,
            name: optCategory.name,
            parent: MLRootCategory.get()
        };
        else {
            console.log("Unknown category_id: " + categoryId);
            return {
                //TODO ml may return a more specific category on item.category_id,
                //TODO and may not return a category in "filters" then we don't know which category to associate that item to
                id: categoryId,
                parent: MLRootCategory.get()
            };
        }

    }

    function findAttributeValue(aspectId, valueId){
        return MLRootCategory.get()
            .aspects.find(hasId(aspectId))
            .values.find(hasId(valueId))
    }

    function parseFilters(content){
        var categoryFilter = content.filters.find(hasId("category"));
        if(!categoryFilter) return undefined;
        assert(categoryFilter.values.length == 1, "There should be only one category in the category filter");
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
