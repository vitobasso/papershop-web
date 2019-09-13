
var Categories = (function() {
    var module = {};

    var set;

    module.init = () => {
        set = new Set(getId);
        var category = {
            id: 'dummy',
            name: 'dummy',
            aspects: []
        };
        set.addMerge(category, Merge.mergeObjects);
        $.subscribe('new-aspects', onNewAspects);
    };

    module.get = () => theUniqueCategory();

    function theUniqueCategory(){
        return set.get({id: 'dummy'});
    }

    function onNewAspects(_, aspects){
        Merge.mergeArrays(theUniqueCategory().aspects, aspects, getId);
        $.publish('new-filters');
    }

    return module;
}());