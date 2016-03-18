
var AxisFactory = (function (){
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

    module.priceAxis = new LinearAxis("Price",
        function (item) {
            return item.price.value;
        });

    //TODO remove, make all aspect(id, name)
    var categoryAxis = new OrdinalAxis("Category", item => item.category.name);
    var conditionAxis = new OrdinalAxis("Condition", item => item.condition.name);
    var listingTypeAxis = new OrdinalAxis("ListingType", item => item.listingType.name);
    var endAxis = new TimeAxis("End", item => item.end);

    module.listOptions = function() {
        var result = [categoryAxis, conditionAxis, listingTypeAxis, endAxis];
        Categories.each(function (category) {
            category.aspects.forEach(function (aspect) {
                result.push(createAspectAxis(aspect.name));
            });
        });
        return result;
    };

    function createAspectAxis(aspectName) {
        return new OrdinalAxis(aspectName,
            function (item) {
                var aspect = item.aspects[aspectName] || {};
                return aspect.value;
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