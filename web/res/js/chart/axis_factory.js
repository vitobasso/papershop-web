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
        this.formatTick = ChartCommon.replaceUndefined;
    }

    module.priceAxis = new LinearAxis("Price", item => item.price.value);

    var categoryAxis = new OrdinalAxis("Category", item => item.category.name);

    module.listOptions = function () {
        var result = [categoryAxis];
        Categories.each(category => {
            var aspects = Categories.getInheritedAspects(category)
            var axes = aspects.map(createAxis)
            result.pushAll(axes)
        });
        return result;
    };

    function createAxis(aspect) {
        return aspect.getFromItem ?
            createRootAspectAxis(aspect) :
            createAspectAxis(aspect);
    }

    function createRootAspectAxis(aspect) {
        if (aspect.axis == "Time") {
            return new TimeAxis(aspect.name, aspect.getFromItem);
        } else {
            var getValueName = _.compose(getName, aspect.getFromItem);
            return new OrdinalAxis(aspect.name, getValueName);
        }
    }

    function createAspectAxis(aspect) {
        return new OrdinalAxis(aspect.name, item => {
            var value = item.aspects[aspect.name] || {};
            return value.name;
        })
    }

    function updateLinearDomain(axis) {
        return function (scale, items) {
            var domain = d3.extent(items, axis.getProperty);
            scale.domain(domain);
        }
    }

    function updateOrdinalDomain(axis) {
        return function (scale, items) {
            var values = ChartCommon.findOrdinalDomain(items, axis.getProperty);
            scale.domain(values);
        }
    }

    return module;
}());