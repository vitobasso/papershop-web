
var Sources = (function () {
    var module = {};

    var options = [
        { 
            id: 'ebay',
            name: "eBay",
            api: new EbayApi(),
            rootCategory: EbayRootCategory.get() 
        },
        { 
            id: 'ml',
            name: "Mercado Libre",
            api: new MLApi(),
            rootCategory: MLRootCategory.get()
        }
    ];

    var selected = options[0];

    module.get = () => selected;

    module.list = () => options;
    
    module.set = (value) => selected = value;

    return module;
}());