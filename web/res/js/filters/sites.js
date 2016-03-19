
var Sites = (function () {
    var module = {};

    var options = [
        { label: "eBay",            api: new EbayApi(), rootCategory: EbayRootCategory.get() },
        { label: "Mercado Libre",   api: new MLApi(),   rootCategory: null } //TODO
    ];

    var selected = options[0];

    module.get = () => selected;

    module.list = () => options;

    return module;
}());