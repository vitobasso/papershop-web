var AxisFactory = (function () {
    var module = {};

    function LinearAxis(label, getProperty) {
        this.label = label;
        this.getProperty = getProperty;
        this.getScale = d3.scale.linear;
        this.updateDomain = updateLinearDomain(this);
    }

    function TimeAxis(label, getProperty) {
        this.label = label;
        this.getProperty = getProperty;
        this.getScale = d3.time.scale;
        this.updateDomain = updateLinearDomain(this);
    }

    function OrdinalAxis(label, getProperty) {
        this.label = label;
        this.getProperty = getProperty;
        this.getScale = d3.scale.ordinal;
        this.updateDomain = updateOrdinalDomain(this);
        this.formatTick = replaceUndefined;
    }

    var dummyAxis = new OrdinalAxis("?", item => null);

    module.listOptions = function () {
        var result = [dummyAxis];
        var aspects = Aspects.list();
        var axes = aspects.map(createAxis);
        result.pushAll(axes);
        return result;
    };

    function createAxis(aspect) {
        if (aspect.axis == "Time") {
            return new TimeAxis(aspect.name, aspect.getFromItem);
        } else {
            var getValueName = _.compose(getName, aspect.getFromItem);
            return new OrdinalAxis(aspect.name, getValueName);
        }
    }

    function updateLinearDomain(axis) {
        return (scale, items) => {
            var domain = d3.extent(items, axis.getProperty);
            scale.domain(domain);
        }
    }

    function updateOrdinalDomain(axis) {
        return (scale, items) => {
            var values = findOrdinalDomain(items, axis.getProperty);
            scale.domain(values);
        }
    }

    function findOrdinalDomain(data, getProperty) {
        var uniqueValues = new Set();
        uniqueValues.addMap(data, getProperty);
        return uniqueValues.toArray().sort(naturalSort);
    }

    function replaceUndefined(value) {
        return value ? value : "?";
    }

    return module;
}());