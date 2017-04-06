
var Sources = (function () {
    var module = {};

    var options = [
        {
            id: 'rest-ebay',
            name: "REST: eBay",
            api: new EbayApi(),
            rootCategory: EbayRootCategory.get()
        },
        { 
            id: 'rest-ml',
            name: "REST: Mercado Libre",
            api: new MLApi(),
            rootCategory: MLRootCategory.get()
        }
    ];

    var selected = options[0];

    var wsApi = new WebSocketApi()
    function scraperSource(name) {
        return {
            id: 'scraper-' + name,
            name: "Scraper: " + name,
            api: wsApi,
            rootCategory: WebSocketApi.getRootCategory()
        }
    }

    $.subscribe('found-new-scraper-sources', (_, names) => {
        console.log('sources.js received found-new-scraper-sources', names)
        var newOptions = names.map(scraperSource)
        options.pushAll(newOptions)
        $.publish('updated-source-list', [options])
    })

    module.init = () => {
        wsApi.requestSourceList()
        $.publish('updated-source-list', [options])
    }

    module.get = () => selected;

    module.list = () => options;

    module.set = (value) => {
        selected = value
        $.publish('selected-source', [value])
    }

    return module;
}());