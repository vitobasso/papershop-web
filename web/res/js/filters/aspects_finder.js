
var AspectsFinder = (function() {
    var module = {};

    module.find = category => { //TODO publish 'request-aspects' to be catched by ebay api, then remove this file?
        var callback = aspects => $.publish('new-aspects', [category, aspects]);
        Sources.get().api.findAspects({categoryId: category.id}, callback);
    };

    return module;
}());