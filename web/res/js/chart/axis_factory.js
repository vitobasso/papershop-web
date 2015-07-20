/**
 * Created by Victor on 09/07/2015.
 */
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

    module.priceAxis = new LinearAxis("Current Price (USD)",
        function (item) {
            return item.price.value;
        });

    var startAxis = new TimeAxis("Start",
        function (item) {
            return item.start;
        });
    var endAxis = new TimeAxis("End",
        function (item) {
            return item.end;
        });
    var conditionAxis = new OrdinalAxis("Condition",
        function (item) {
            return item.condition.name;
        });
    var listingTypeAxis = new OrdinalAxis("ListingType",
        function (item) {
            return item.listingType;
        });
    var categoryAxis = new OrdinalAxis("Category",
        function (item) {
            return item.category.name;
        });

    module.listOptions = function() {
        var result = [conditionAxis, listingTypeAxis, startAxis, endAxis, categoryAxis];
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
            scale.domain(domain).nice();
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