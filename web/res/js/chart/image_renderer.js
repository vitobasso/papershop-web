/**
 * Created by Victor on 17/07/2015.
 */
function ImageDataRenderer(canvas, data) {

    var size = 50;

    this.radius = size/2;
    this.render = render;
    this.getTooltipParams = getTooltipParams;

    ////////////////////////////////////////////////////////////////////////////////////

    function render() {
        var images = canvas.selectAll("image").data(data, getId);

        images
            .call(updatePosition);

        images.enter()
            .append("image")
            .attr("class", "dot")
            .attr("width", size)
            .attr("height", size)
            .attr("xlink:href", getImage)
            .call(updatePosition)
            .on("click", function (datum) {
                window.open(datum.link);
            });

        images.exit()
            .remove();
    }

    function updatePosition(sel) {
        sel.attr("x", getX)
            .attr("y", getY);
    }

    function getX(datum) {
        return datum.point.x - size/2;
    }

    function getY(datum) {
        return datum.point.y - size/2;
    }

    function getImage(datum) {
        return datum.image;
    }

////////////////////////////////////////////////////////////////////////////////////

    function getTooltipParams() {
        return {
            items: "image",
            content: buildTooltip
        }
    }

    function buildTooltip() {
        var item = this.__data__;
        var priceStr = item.price.currency + " " + item.price.value;
        return "<div class='chart-tooltip'>" +
            "<p>" + item.title + "</p>" +
            "<img src='" + item.image + "'/>" +
            "<p>" + priceStr + "</p>" +
            "</div>";
    }

}