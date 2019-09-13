
var FilterBuilder = (function() {
    var module = {};

    module.init = () => {
        $.subscribe('init', populateFilters);
        $.subscribe('new-filters', populateFilters);
    };

    function populateFilters() {
        var aspects = Categories.get().aspects;
        FilterUI.populate(aspects, "aspect");
    }

    return module;
}());