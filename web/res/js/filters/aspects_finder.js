
var AspectsFinder = (function() {
    var module = {};

    module.find = category => {
        var callback = aspects => $.publish('new-aspects', [category, aspects]);
        Sites.getSelected().findAspects({categoryId: category.id}, callback);
    };

    return module;
}());