/**
 * Created by Victor on 30/06/2015.
 */

function Chart(xParam, yParam) {

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = xParam.scale()
        .range([0, width]);

    var y = xParam.scale()
        .range([0, height]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = initSvg();

    this.refresh = function(data) {
        refreshAxes(data);
        var circles = svg.selectAll("circle").data(data);

        circles.transition()
            .attr("cx", function (d) {
                return x(xParam.fun(d))
            })
            .attr("cy", function (d) {
                return y(yParam.fun(d))
            });

        circles.enter()
            .append("svg:circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function (d) {
                return x(xParam.fun(d))
            })
            .attr("cy", function (d) {
                return y(yParam.fun(d))
            })
    };

    function refreshAxes(data) {
        x.domain(d3.extent(data, xParam.fun)).nice();
        y.domain(d3.extent(data, yParam.fun)).nice();
        svg.selectAll(".axis").filter(".x").call(xAxis);
        svg.selectAll(".axis").filter(".y").call(yAxis);
    }

    function initSvg() {
        var svg = d3.select("#canvas").append("svg:svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(xParam.label);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yParam.label);

        return svg;
    }

}

Chart.scaleType = Object.freeze({
    LINEAR: d3.scale.linear,
    TIME: d3.time.scale
});
