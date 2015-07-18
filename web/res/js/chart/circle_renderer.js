/**
 * Created by Victor on 17/07/2015.
 */
function CircleDataRenderer(canvas, data, colorScale, colorParam) {

    var radius = 3.5;
    var legend = new ChartLegend("#top", colorScale);

    this.radius = radius;
    this.render = render;

    legend.render(data, colorParam);

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

}