
function DataLayout(getTargetPosition) {

    this.startLayout = startLayout;

    var force = d3.layout.force()
        .gravity(0)
        .charge(0);

    var radius;

    function startLayout(data, dataRenderer, bounds) {
        initPositions(data);
        radius = dataRenderer.radius;
        var points = data.map(getPoint);

        force.stop();
        force.nodes(points);
        force.on("tick", function (e) {
            moveTorwardsTarget(data, e);
            avoidCollisions(points);
            respectBounds(points, bounds);
            dataRenderer.render();
        });
        force.start();
    }

    function moveTorwardsTarget(data, e) {
        var cooling = 0.1 * e.alpha;
        data.forEach(function (datum) {
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
        var r = radius,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
        return function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var dx = node.x - quad.point.x,
                    dy = node.y - quad.point.y,
                    l = Math.sqrt(dx * dx + dy * dy),
                    r = 2* radius;
                if (l < r) {
                    if (l > 0) {
                        l = (l - r) / l * .5;
                        node.x -= dx *= l;
                        node.y -= dy *= l;
                    } else {
                        node.x += radius; //avoid division by 0 when node & quad.point coincide
                    }
                    quad.point.x += dx;
                    quad.point.y += dy;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }

    function respectBounds(points, bounds){
        points.forEach(function(point) {
            point.x = fitNumber(point.x, bounds.x + radius, bounds.width - radius);
            point.y = fitNumber(point.y, bounds.y + radius, bounds.height - radius);
        });
    }

    function fitNumber(value, min, max) {
        return Math.max(min, Math.min(max, value))
    }

    function getPoint(datum) {
        return datum.point;
    }

    function initPositions(data) {
        data.forEach(initPosition);
    }

    function initPosition(datum) {
        if (!datum.point) {
            datum.point = getTargetPosition(datum);
            displaceRandomly(datum.point); // avoid getting stuck in a vertical stack
        }
    }

    function displaceRandomly(point) {
        point.x += Math.random() * 2 * radius - radius; // between -radius and +radius
    }

}