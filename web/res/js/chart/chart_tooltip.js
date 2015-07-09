/**
 * Created by Victor on 09/07/2015.
 */
function ChartTooltip() {

    this.render = function() {
        var item = this.__data__;
        var priceStr = item.price.currency + " " + item.price.value;
        return "<div class='chart-tooltip'>" +
            "<img src='" + item.image + "'/>" +
            "<p>" + item.title + "</p>" +
            "<p>" + "Price: " + priceStr + "</p>" +
            "<p>" + "Category: " + item.category.name + "</p>" +
            "<p>" + "Condition: " + item.condition.name + "</p>" +
            renderAspectsForTooltip(item) +
            "</div>";
    }

    function renderAspectsForTooltip(item) {
        var result = "";
        for (var aspectName in item.aspects) {
            if (item.aspects.hasOwnProperty(aspectName)) {
                result += "<p>" + aspectName + ": " + renderAspectValueForTooltip(item.aspects[aspectName]) + "</p>";
            }
        }
        return result;
    }

    function renderAspectValueForTooltip(aspectValue) {
        var result = aspectValue.value;
        if (aspectValue.confidence < 1) {
            result += " (?" + Number(aspectValue.confidence).toFixed(2) + ")";
        }
        return result;
    }

}