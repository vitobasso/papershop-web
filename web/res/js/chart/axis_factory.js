/**
 * Created by Victor on 09/07/2015.
 */
function AxisFactory(categories){

    this.listOptions = listOptions;

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
        this.updateDomain = updateOrdinalDomain(this)
        this.formatTick = EbayChart.replaceUndefined;
    }

    this.priceAxis = new LinearAxis("Current Price (USD)",
        function (item) {
            return item.price.value;
        });

    var listingTimeAxis = new TimeAxis("Listing Begin",
        function (item) {
            return item.listingTime;
        });
    var conditionAxis = new OrdinalAxis("Condition",
        function (item) {
            return item.condition.name;
        });
    var categoryAxis = new OrdinalAxis("Category",
        function (item) {
            return item.category.name;
        });

    function listOptions() {
        var result = [conditionAxis, categoryAxis, listingTimeAxis];
        categories.each(function (category) {
            category.aspects.forEach(function (aspect) {
                result.push(createAspectAxis(aspect.name));
            });
        });
        return result;
    }

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
            var values = EbayChart.findOrdinalDomain(items, axis.getProperty);
            scale.domain(values);
        }
    }

}