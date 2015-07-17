/**
 * Created by Victor on 30/06/2015.
 */

function ScatterPlot(parentDivId) {

    var margin = {top: 20, right: 20, bottom: 40, left: 40};
    var svgWidth, svgHeight, width, height;

    var svg, canvas;
    var yParam, xParam, colorParam;
    var xScale, yScale, colorScale;
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

    this.colorScale = function (datum) {
        return colorScale(datum);
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
        xScale = setXRange(xParam.getScale());
        yScale = setYRange(yParam.getScale());
        colorScale = setColorRange(colorParam.getScale());
    }

    function populate() {
        updateDomains();
        axes.update();
        startLayout();
    }

    function updateDomains() {
        xParam.updateDomain(xScale, _data);
        yParam.updateDomain(yScale, _data);
        colorParam.updateDomain(colorScale, _data);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    function renderCircles() {
        var circles = canvas.selectAll("circle").data(_data, getId);

        circles
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

    ////////////////////////////////////////////////////////////////////////////////////////////

    function startLayout() {
        initPositions(_data);
        var points = _data.map(getPoint);

        var force = d3.layout.force()
            .size([width, height])
            .gravity(0)
            .charge(0)
            .nodes(points);

        force.on("tick", function (e) {
            moveTorwardsTarget(e);
            avoidCollisions(points);
            renderCircles();
        });

        force.start();
    }

    function moveTorwardsTarget(e) {
        var cooling = 0.1 * e.alpha;
        _data.forEach(function (datum, i) {
            var target = getTargetPosition(datum);
            var point = datum.point;
            point.y += (target.y - point.y) * cooling;
            point.x += (target.x - point.x) * cooling;
        });
    }

    function avoidCollisions(points) {
        var q = d3.geom.quadtree(points);
        points.forEach(function (point) {
            var adjustPosition = collide(point);
            q.visit(adjustPosition);
        });

    }

    function collide(node) {
        var r = node.radius,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
        return function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var dx = node.x - quad.point.x,
                    dy = node.y - quad.point.y,
                    l = Math.sqrt(dx * dx + dy * dy),
                    r = node.radius + quad.point.radius;
                if (l < r) {
                    if (l > 0) {
                        l = (l - r) / l * .5;
                        node.x -= dx *= l;
                        node.y -= dy *= l;
                    } else {
                        node.x += node.radius; //avoid division by 0 when node & quad.point coincide
                    }
                    quad.point.x += dx;
                    quad.point.y += dy;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }

    function getPoint(datum) {
        return datum.point;
    }

////////////////////////////////////////////////////////////////////////////////////////////

    function initPositions(data) {
        data.forEach(initPosition);
    }

    function initPosition(datum) {
        if (!datum.point) {
            datum.point = getTargetPosition(datum);
        }
    }

    function getTargetPosition(datum) {
        return {
            x: getTargetX(datum),
            y: getTargetY(datum),
            radius: 3.5
        }
    }

    function getTargetX(datum) {
        return xScale(xParam.getProperty(datum))
    }

    function getTargetY(datum) {
        return yScale(yParam.getProperty(datum))
    }

    function getColor(datum) {
        return colorScale(colorParam.getProperty(datum))
    }

////////////////////////////////////////////////////////////////////////////////////////////

    function Axes() {

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");
        if (xParam.formatTick) {
            xAxis.tickFormat(xParam.formatTick)
        }

        var yAxis = d3.svg.axis()
            .scale(yScale)
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

}