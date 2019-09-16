
var Aspects = (function() {
    var module = {};

    var set;

    module.init = () => {
        set = new Set(getId);
        $.subscribe('new-aspects', onNewAspects);
    };

    module.list = () => set.toArray();

    function onNewAspects(_, aspects){
        set.addMergeAll(aspects, Merge.mergeObjects);
        $.publish('new-filters');
    }

    return module;
}());