/**
 * Created by Victor on 09/07/2015.
 */
function ChartAxes(categories){

    function LinearAxis(label, getProperty, getScale) {
        this.label = label;
        this.getProperty = getProperty;
        this.getScale = getScale;
        this.updateDomain = updateLinearDomain(this);
    }

    function OrdinalAxis(label, getProperty) {
        this.label = label;
        this.getProperty = getProperty;
        this.getScale = d3.scale.ordinal;
        this.updateDomain = updateOrdinalDomain(this);
    }

    this.priceAxis = new LinearAxis("Current Price (USD)",
        function (item) {
            return item.price.value;
        },
        d3.scale.linear);

    var listingTimeAxis = new LinearAxis("Listing Begin",
        function (item) {
            return item.listingTime;
        },
        d3.time.scale);
    var conditionAxis = new OrdinalAxis("Condition",
        function (item) {
            return item.condition.name;
        });
    var categoryAxis = new OrdinalAxis("Category",
        function (item) {
            return item.category.name;
        });

    this.listOptions = function () {
        var result = [conditionAxis, categoryAxis, listingTimeAxis];
        categories.each(function (category) {
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
            var domain = getOrdinalDomain(items, axis.getProperty);
            scale.domain(domain);
        }
    }

    function getOrdinalDomain(data, getProperty) {
        var uniqueValues = new Set();
        uniqueValues.addMap(data, getProperty);
        return uniqueValues.toArray().sort(naturalSort);
    }

}