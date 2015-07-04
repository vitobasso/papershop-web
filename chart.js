/**
 * Created by Victor on 30/06/2015.
 */

function Chart(xParam, yParam) {

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = initXScale(xParam.scale());

    var y = yParam.scale()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = initSvg();

    this.populate = function (items) {
        refreshAxes(items);
        var circles = svg.selectAll("circle").data(items, getId);

        circles.transition()
            .attr("cx", function (item) {
                return x(xParam.fun(item))
            })
            .attr("cy", function (item) {
                return y(yParam.fun(item))
            });

        circles.enter()
            .append("svg:circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function (item) {
                return x(xParam.fun(item))
            })
            .attr("cy", function (item) {
                return y(yParam.fun(item))
            })
            .on("click", function (item) {
                window.open(item.link);
            });

        assignTooltips();
    };

    function assignTooltips() { //TODO extract knowledge about item
        $("#chart").find("svg").tooltip({
            items: "circle",
            content: buildTooltip
        });
        function buildTooltip() {
            var item = this.__data__;
            var priceStr = item.price.currency + " " + item.price.value;
            return "<div class='chart-tooltip'>" +
                "<img src='" + item.image + "'/>" +
                "<p>" + item.title + "</p>" +
                "<p>" + "Price: " + priceStr + "</p>" +
                "<p>" + "Category: " + item.category.name + "</p>" +
                "<p>" + "Condition: " + item.condition.name + "</p>" +
                "</div>";
        }
    }

    function refreshAxes(items) {
        resetDomain(x, items);
        resetDomain(y, items);
        y.domain(d3.extent(items, yParam.fun)).nice();
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

    function getId(object) {
        return object.id;
    }

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

    function resetDomain(scale, items) {
        if (isOrdinal(scale)) {
            scale.domain(items.map(xParam.fun));
        } else {
            scale.domain(d3.extent(items, xParam.fun)).nice();
        }
    }

}