/**
 * Created by Victor on 17/07/2015.
 */
function CircleDataRenderer(canvas, data, colorScale, colorParam) {

    var radius = 3.5;
    var legend = new ChartLegend("#top", colorScale);

    this.getRadius = function(){return radius};
    this.render = render;
    this.getTooltipParams = getTooltipParams;

    legend.render(data, colorParam);

////////////////////////////////////////////////////////////////////////////////////

    function render() {
        var circles = canvas.selectAll("circle").data(data, getId);

        circles
            .call(positionCircle);

        circles.enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", radius)
            .call(positionCircle)
            .on("click", function (datum) {
                window.open(datum.link);
            });

        circles.exit()
            .remove();
    }

    function positionCircle(sel) {
        sel.attr("cx", getX)
            .attr("cy", getY)
            .style("fill", getColor);
    }

    function getX(datum) {
        return datum.point.x;
    }

    function getY(datum) {
        return datum.point.y;
    }

    function getColor(datum) {
        return colorScale(colorParam.getProperty(datum));
    }

////////////////////////////////////////////////////////////////////////////////////

    function getTooltipParams() {
        return {
            items: "circle",
            content: buildTooltip
        }
    }

    function buildTooltip() {
        var item = this.__data__;
        var priceStr = item.price.currency + " " + item.price.value;
        return "<div class='chart-tooltip'>" +
            "<p>" + item.title + "</p>" +
            "<img src='" + item.image + "'/>" +
            "<p>" + priceStr + "</p>" +
            "</div>";
    }

}