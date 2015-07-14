/**
 * Created by Victor on 14/07/2015.
 */
function ChartLegend(chartDivId, chart) {

    this.render = render;

    var svg = d3.select(chartDivId).select("svg");

    function render(data, colorParam) {
        var legend = getLegend();
        var values = listValues(data, colorParam);
        renderRow(legend, values);
    }

    function renderRow(legend, values) {
        var selItem = legend
            .selectAll("g").data(values, identity)
            .enter().append("g")
            .attr("transform", legendRowTransform);

        selItem.append("circle")
            .attr("cx", 5)
            .attr("cy", 5)
            .attr("r", 3.5)
            .style("fill", function (datum) {
                return chart.colorScale(datum)
            });

        selItem.append("text")
            .attr("x", 14)
            .attr("y", 9)
            .html(function (datum) {
                return datum
            });
    }

    function getLegend() {
        var legend = svg.select(".legend");
        if (legend.empty()) {
            legend = create();
        }
        return legend;
    }

    function create() {
        var pos = initialPosition();

        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + pos.x + "," + pos.y + ")")
            .call(d3.behavior.drag().on("drag", dragmove));

        legend.append("rect")
            .attr("width", "100")
            .attr("height", "100")
            .attr("x", "-10")
            .attr("y", "-10");

        function dragmove() {
            var x = d3.event.x;
            var y = d3.event.y;
            legend.attr("transform", "translate(" + x + "," + y + ")");
        }

        return legend;
    }

    function listValues(data, colorParam) {
        var getColorAxisProperty = function (datum) {
            return colorParam.getProperty(datum);
        };
        return d3.map(data, getColorAxisProperty).keys();
    }

    function legendRowTransform(datum, i) {
        return "translate(0," + i * 20 + ")";
    }

    function initialPosition() {
        var bbox = svg.node().getBoundingClientRect();
        return {
            x: bbox.width *.8,
            y: 20
        }
    }
}