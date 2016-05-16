
var Config = (function () {
    var module = {};

    module.init = function () {
        populate('#source', Sources.list());
    };

    function populate(selectId, data) {
        var select = d3.select(selectId);

        select.selectAll('option').data(data, getId)
            .enter().append('option')
            .attr("value", getId)
            .html(getName);

        select.on("change", handleSelection(selectId, Sources.set));
    }

    function handleSelection(selectId, fun){
        return () => fun(getSelectedItem(selectId))
    }

    function getSelectedItem(selectId) {
        var select = d3.select(selectId),
            options = select.selectAll('option'),
            index = select.property('selectedIndex'),
            option = options.filter((d, i) => i === index);
        return option.datum();
    }

    return module;
}());