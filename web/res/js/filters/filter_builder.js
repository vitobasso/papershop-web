
var FilterBuilder = (function() {
    var module = {};

    module.init = () => {
        $.subscribe('init', populateFilters);
        $.subscribe('new-filters', populateFilters);
    };

    function populateFilters() {
        var aspects = Aspects.list();
        FilterUI.populate(aspects, "aspect");
    }

    return module;
}());