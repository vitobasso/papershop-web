
var Sources = (function () {
    var module = {};

    var options = [{
        id: 'none',
        name: "none",
        api: {}
    }];

    var selected = options[0];

    var wsApi = new WebSocketApi()
    function scraperSource(name) {
        return {
            id: 'scraper-' + name,
            name: "Scraper: " + name,
            api: wsApi
        }
    }

    $.subscribe('found-new-scraper-sources', (_, names) => {
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