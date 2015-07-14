/**
 * Created by Victor on 14/07/2015.
 */
function ChartLegend(parentDivId, chart) {

    this.render = render;

    var selParent = d3.select(parentDivId);

    function render(data, colorParam) {
        var legend = getLegend();
        var values = listValues(data, colorParam);
        setTitle(legend, colorParam);
        renderRows(legend, values);
    }

    function renderRows(legend, values) {
        var selItem = legend
            .selectAll("div .row").data(values, identity);

        selItem.exit().remove();

        selItem = selItem.enter().append("div")
            .classed("row", true);

        selItem.append("div")
            .classed("color", true)
            .style("background", function (datum) {
                return chart.colorScale(datum)
            });

        selItem.append("div")
            .classed("text", true)
            .html(function (datum) {
                return datum
            });
    }

    function setTitle(legend, colorParam) {
        legend.selectAll("div .title")
            .html(colorParam.label);
    }

    function getLegend() {
        var legend = selParent.select("#chart-legend");
        if (legend.empty()) {
            legend = createLegend();
        }
        return legend;
    }

    function createLegend() {
        var pos = initialPosition();

        var legend = selParent.append("div")
            .attr("id", "chart-legend")
            .style("left", pos.x + "px")
            .style("top", pos.y + "px")
            .call(d3.behavior.drag()
                .on("drag", dragmove));

        legend.append("div")
            .classed("title", true);

        function dragmove() {
            var x = legend.node().offsetLeft + d3.event.dx;
            var y = legend.node().offsetTop + d3.event.dy;
            legend.style("left", x + "px");
            legend.style("top", y + "px");
        }

        return legend;
    }

    function listValues(data, colorParam) {
        var getColorAxisProperty = function (datum) {
            return colorParam.getProperty(datum);
        };
        return d3.map(data, getColorAxisProperty).keys();
    }

    function initialPosition() {
        var bbox = selParent.node().getBoundingClientRect();
        return {
            x: bbox.width * .8,
            y: 20
        }
    }
}