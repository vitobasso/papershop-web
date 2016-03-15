
var Sites = (function () {
    var module = {};

    var options = [
        { label: "eBay",            api: new EbayApi() },
        { label: "Mercado Libre",   api: new MLApi()   }
    ];

    var selected = options[0];

    module.getSelected = () => selected.api;

    module.getOptions = () => options;

    return module;
}());