var ItemGroomer = (function () {
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