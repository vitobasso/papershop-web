
var Sites = (function () {
    var module = {};

    var options = [
        { label: "eBay",            api: new EbayApi() },
        { label: "Mercado Libre",   api: new MLApi()   }
    ];

    var selected = options[1];

    module.getSelected = () => selected.api;

    module.getOptions = () => options;

    return module;
}());