/**
 * Created by Victor on 14/07/2015.
 */
function ChartLegend(chartDivId, chart) {

    this.render = render;

    var svg = d3.select(chartDivId).select("svg");

    function render(data, colorParam) {

        var uniqueValues = d3.map(data, function (datum) {
            return colorParam.getProperty(datum);
        }).keys();

        var legend = svg.select(".legend");
        if (legend.empty()) {

            var pos = initialPosition();

            legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + pos.x + "," + pos.y + ")")
                .call(d3.behavior.drag().on("drag", dragmove));

            legend.append("rect")
                .attr("width", "100")
                .attr("height", "100")
                .attr("x", "-10")
                .attr("y", "-10");
        }

        var selItem = legend
            .selectAll("g").data(uniqueValues, identity)
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

        function legendRowTransform(datum, i) {
            return "translate(0," + i * 20 + ")";
        }

        function dragmove() {
            var x = d3.event.x;
            var y = d3.event.y;
            legend.attr("transform", "translate(" + x + "," + y + ")");
        }
    }

    function initialPosition() {
        var bbox = svg.node().getBoundingClientRect();
        return {
            x: bbox.width *.8,
            y: 20
        }
    }
}