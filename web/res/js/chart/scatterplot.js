/**
 * Created by Victor on 30/06/2015.
 */

function Chart(yParam, xParam, colorParam, onRenderTooltip) {

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = initXScale(xParam.scale());

    var y = yParam.scale().range([height, 0]);

    var colorScale = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(replaceUndefined);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = initSvg();

    this.populate = function (data) {
        renderAxes(data);
        renderCircles(data);
        renderLegend();
        assignTooltips();
    };

    function renderCircles(data) {
        var circles = svg.selectAll("circle").data(data, getId);

        circles.transition()
            .attr("cx", function (datum) {
                return x(xParam.fun(datum))
            })
            .attr("cy", function (datum) {
                return y(yParam.fun(datum))
            });

        circles.enter()
            .append("svg:circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function (datum) {
                return x(xParam.fun(datum))
            })
            .attr("cy", function (datum) {
                return y(yParam.fun(datum))
            })
            .style("fill", function (datum) {
                var fun = colorParam.ifun || colorParam.fun;
                return colorScale(fun(datum))
            })
            .attr("data-legend", colorParam.fun)
            .on("click", function (datum) {
                window.open(datum.link);
            });

    }

    function renderLegend() {
        var initpos = {
            x: width - margin.right - 120,
            y: margin.top
        };

        var sel = svg.select(".legend");
        if (sel.empty()) {
            sel = svg.append("g");
        }
        sel.attr("class", "legend")
            .attr("transform", "translate(" + initpos.x + "," + initpos.y + ")")
            .call(d3.legend)
            .call(d3.behavior.drag()
                .on("drag", dragmove));

        function dragmove() {
            var x = d3.event.x;
            var y = d3.event.y;
            sel.attr("transform", "translate(" + x + "," + y + ")");
        }
    }

    function assignTooltips() {
        $("#chart").find("svg").tooltip({
            items: "circle",
            content: onRenderTooltip
        });
    }

    function renderAxes(data) {
        resetDomain(x, data);
        y.domain(d3.extent(data, yParam.fun)).nice();
        svg.selectAll(".axis").filter(".x").call(xAxis);
        svg.selectAll(".axis").filter(".y").call(yAxis);
    }

    function initSvg() {
        var svg = d3.select("#chart").append("svg:svg")
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

    this.destroy = function () {
        d3.select("#chart").html("");
    };

    function isOrdinal(scale) {
        return typeof scale.rangePoints === "function";
    }

    function initXScale(scale) {
        if (isOrdinal(scale)) {
            scale.rangePoints([0, width], .5);
        } else {
            scale.range([0, width]);
        }
        return scale;
    }

    function resetDomain(scale, data) {
        if (isOrdinal(scale)) {
            var domainValues = getOrdinalDomain(data, xParam.fun);
            scale.domain(domainValues);
        } else {
            scale.domain(d3.extent(data, xParam.fun)).nice();
        }
    }

    function getOrdinalDomain(data, getProperty) {
        var uniqueValues = new Set();
        uniqueValues.addMap(data, getProperty);
        return uniqueValues.toArray().sort(naturalSort);
    }

    function replaceUndefined(value) {
        return value ? value : "?";
    }

}