/**
 * Created by Victor on 30/06/2015.
 */

function Chart(parentDivId) {

    var margin = {top: 20, right: 20, bottom: 40, left: 40};
    var svgWidth, svgHeight, width, height;

    var svg, canvas;
    var yParam, xParam, colorParam;
    var x, y, colorScale;
    var axes;
    var _data;

    this.setData = function (data) {
        _data = data;
        populate();
    };

    this.update = function (data, newYParam, newXParam, newColorParam) {
        yParam = newYParam;
        xParam = newXParam;
        colorParam = newColorParam;
        _data = data;
        render()
    };

    /////////////////////////////////////////////////////

    createCanvasFillingParent();
    d3.select(window).on("resize", resize);

    function createCanvasFillingParent() {
        var parent = d3.select(parentDivId).node();
        createCanvasWithSize(parent.clientWidth, parent.clientHeight);
    }

    function createCanvasWithSize(newWidth, newHeight) {
        svgWidth = newWidth;
        svgHeight = newHeight;
        width = svgWidth - margin.left - margin.right;
        height = svgHeight - margin.top - margin.bottom;
        createCanvas();
    }

    function createCanvas() {
        d3.select(parentDivId).html("");

        svg = d3.select(parentDivId).append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        canvas = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    }

    /////////////////////////////////////////////////////

    function resize() {
        createCanvasFillingParent();
        render();
    }

    function render() {
        createScales();
        axes = new Axes();
        axes.init();
        populate();
    }

    function createScales() {
        x = setXRange(xParam.getScale());
        y = setYRange(yParam.getScale());
        colorScale = setColorRange(colorParam.getScale());
    }

    function populate() {
        updateDomains();
        axes.update();
        renderCircles();
    }

    function updateDomains() {
        xParam.updateDomain(x, _data);
        yParam.updateDomain(y, _data);
        colorParam.updateDomain(colorScale, _data);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    function renderCircles() {
        var circles = canvas.selectAll("circle").data(_data, getId);

        circles.transition()
            .call(positionCircle);

        circles.enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .call(positionCircle)
            .on("click", function (datum) {
                window.open(datum.link);
            });

        circles.exit()
            .remove();

        renderLegend();
    }

    function positionCircle(sel) {
        sel.attr("cx", function (datum) {
            return x(xParam.getProperty(datum))
        })
            .attr("cy", function (datum) {
                return y(yParam.getProperty(datum))
            })
            .style("fill", function (datum) {
                return colorScale(colorParam.getProperty(datum))
            });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    function Axes() {

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        if (xParam.formatTick) {
            xAxis.tickFormat(xParam.formatTick)
        }

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        this.init = function () {
            canvas.selectAll(".axis").remove();

            canvas.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "x label")
                .attr("x", width)
                .attr("y", -6)
                .text(xParam.label);

            canvas.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "y label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .text(yParam.label);
        };

        this.update = function () {
            canvas.selectAll(".axis").filter(".x").call(xAxis);
            canvas.selectAll(".axis").filter(".y").call(yAxis);
        };

    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    function setXRange(scale) {
        if (isOrdinal(scale)) {
            scale.rangePoints([0, width], .5);
        } else {
            scale.range([0, width]);
        }
        return scale;
    }

    function setYRange(scale) {
        scale.range([height, 0]);
        return scale;
    }

    function setColorRange(scale) {
        var range = d3.scale.category10().range();
        scale.range(range);
        return scale;
    }

    function isOrdinal(scale) {
        return typeof scale.rangePoints === "function";
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    function renderLegend() {
        var initpos = {
            x: margin.left + 0.8 * width,
            y: margin.top
        };

        var uniqueValues = d3.map(_data, function (datum) {
            return colorParam.getProperty(datum);
        }).keys();

        var selLegend = svg.select(".legend");
        if (selLegend.empty()) {
            selLegend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + initpos.x + "," + initpos.y + ")")
                .call(d3.behavior.drag().on("drag", dragmove));

            selLegend.append("rect")
                .attr("width", "100")
                .attr("height", "100")
                .attr("x", "-10")
                .attr("y", "-10");

        }

        var selItem = selLegend
            .selectAll("g").data(uniqueValues, identity)
            .enter().append("g")
            .attr("transform", legendRowTransform);

        selItem.append("circle")
            .attr("cx", 5)
            .attr("cy", 5)
            .attr("r", 3.5)
            .style("fill", function (datum) {
                return colorScale(datum)
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
            selLegend.attr("transform", "translate(" + x + "," + y + ")");
        }
    }

}