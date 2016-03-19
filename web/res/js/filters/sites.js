
var Sites = (function () {
    var module = {};

    var options = [
        { label: "eBay",            api: new EbayApi(), rootCategory: EbayRootCategory.get() },
        { label: "Mercado Libre",   api: new MLApi(),   rootCategory: MLRootCategory.get() }
    ];

    var selected = options[1];

    module.get = () => selected;

    module.list = () => options;

    return module;
}());