
function AxisRenderer(canvas, width, height, xScale, yScale, xParam, yParam) {

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
    if (xParam.formatTick) {
        xAxis.tickFormat(xParam.formatTick)
    }
    this.x = xAxis

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
    this.y = yAxis

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

}
