/**
 * Created by Victor on 30/06/2015.
 */
var ChartRenderer = (function() {
    var module = {};

    var chartDivId = "#chart";
    var margin = {top: 0, right: 2, bottom: 150, left: 40};
    var svgWidth, svgHeight, width, height;

    var svg, canvas;
    var yParam, xParam;
    var xScale, yScale;
    var axes, dataRenderer;
    var dataLayout;
    var _data;

    module.init = function() {
        dataLayout = new DataLayout(getTargetPosition);

        createCanvasFillingParent();
        d3.select(window).on("resize", resize);
    };

    module.setData = function (data) {
        _data = data;
        populate();
    };

    module.update = function (data, newYParam, newXParam) {
        yParam = newYParam;
        xParam = newXParam;
        _data = data;
        render()
    };

    /////////////////////////////////////////////////////

    function createCanvasFillingParent() {
        var parent = d3.select(chartDivId).node();
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
        d3.select(chartDivId).html("");

        svg = d3.select(chartDivId).append("svg")
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
        populate();
    }

    function createScales() {
        xScale = setXRange(xParam.getScale());
        yScale = setYRange(yParam.getScale());
    }

    function populate() {
        axes = new Axes();
        axes.init();
        updateDomains();
        axes.update();
        dataRenderer = new DataRenderer(canvas, _data, getDataBounds());
        dataLayout.startLayout(_data, dataRenderer, getDataBounds());
        assignTooltips();
    }

    function getDataBounds() {
        return {
            x: 0,
            y: 0,
            width: width,
            height: height
        }
    }

    function assignTooltips() {
        $(chartDivId).find("svg").tooltip(ItemTooltip.getParams());
    }

    function updateDomains() {
        xParam.updateDomain(xScale, _data);
        yParam.updateDomain(yScale, _data);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

    function getTargetPosition(datum) {
        return {
            x: getTargetX(datum),
            y: getTargetY(datum)
        }
    }

    function getTargetX(datum) {
        return xScale(xParam.getProperty(datum))
    }

    function getTargetY(datum) {
        return yScale(yParam.getProperty(datum))
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
            canvas.selectAll(".axis.x").call(xAxis)
                .selectAll("text:not(.label)").call(handleTextOverlap);
            canvas.selectAll(".axis.y").call(yAxis);
        };

        function handleTextOverlap(selText){
            if(selText.size() > 8){
                rotateText(selText);
            }
        }

        function rotateText(selText){
            selText.style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)" );
        }

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

    function isOrdinal(scale) {
        return typeof scale.rangePoints === "function";
    }

    return module;
}());