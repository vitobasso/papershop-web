var ItemGroomer = (function () { //TODO remove, subscribe from items.js directly
    var module = {};

    module.init = () => {
        $.subscribe('find-items', onFindItems);
    };

    function onFindItems(_, requestParams, result) {
        var newItems = result.items;
        Items.merge(newItems);
    }

    return module;
}());