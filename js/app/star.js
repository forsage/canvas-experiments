define(function (require) {

    var Point = require("../app/point");

    var star = function (cx, cy, cz, spikes, outerRadius, parent, normalVector, renderContext) {
        var innerRadius = this.calculateInnerRadius(spikes, outerRadius);
        var rot = Math.PI / 2 * 3;
        var edgeX = cx;
        var edgeY = cy;
        var edgeZ = cz;
        var step = Math.PI / spikes;

        this.points = [];
        this.renderContext = renderContext;

        var pointStart = new Point(parent, this.shuffleCoordinates([cx, cy - outerRadius, cz], normalVector, [cx, cy, cz]), true, this.renderContext);
        this.points.push(pointStart);
        parent.points.push(pointStart);
        for (var ixSpike = 0; ixSpike < spikes; ixSpike++) {
            edgeX = cx + Math.cos(rot) * outerRadius;
            edgeY = cy + Math.sin(rot) * outerRadius;
            var pointOuter = new Point(parent, this.shuffleCoordinates([edgeX, edgeY, edgeZ], normalVector, [cx, cy, cz]), true, this.renderContext);
            this.points.push(pointOuter);
            parent.points.push(pointOuter);
            rot += step;

            edgeX = cx + Math.cos(rot) * innerRadius;
            edgeY = cy + Math.sin(rot) * innerRadius;
            var pointInner = new Point(parent, this.shuffleCoordinates([edgeX, edgeY, edgeZ], normalVector, [cx, cy, cz]), true, this.renderContext);
            this.points.push(pointInner);
            parent.points.push(pointInner);
            rot += step;
        }
        var pointEnd = new Point(parent, this.shuffleCoordinates([cx, cy - outerRadius, edgeZ], normalVector, [cx, cy, cz]), true, this.renderContext);
        this.points.push(pointEnd);
        parent.points.push(pointEnd);
    };

    star.prototype = {

        draw: function () {
            for (var ixPoint = 0; ixPoint < this.points.length; ixPoint++) {
                var p = this.points[ixPoint];
                if (ixPoint == 0) {
                    this.renderContext.canvas.ctx.moveTo(p.X, p.Y);
                } else {
                    this.renderContext.canvas.ctx.lineTo(p.X, p.Y);
                }
            }
        },

        calculateInnerRadius: function (spikes, outerRadius) {
            if (spikes % 2 == 0) {
                return Math.round(outerRadius / 1.75);
            } else {
                return Math.round(outerRadius / 3);
            }
        },

        shuffleCoordinates: function (xyz, normalVector, cxcycz) {
            var x = xyz[0];
            var y = xyz[1];
            var z = xyz[2];
            var shuffled = [];
            var nx = normalVector[0];
            var ny = normalVector[1];
            var nz = normalVector[2];
            var cx = cxcycz[0];
            var cy = cxcycz[1];
            var cz = cxcycz[2];

            if (nx == 1) {
                shuffled = [z + cx - cz, y, x - cx + cz];
            } else if (nx == -1) {
                shuffled = [z + cx - cz, y, x - cx + cz];
            } else if (ny == 1) {
                shuffled = [x, z + cy - cz, y - cy + cz];
            } else if (ny == -1) {
                shuffled = [x, z + cy - cz, y - cy + cz];
            } else if (nz == 1) {
                shuffled = [x, y, z];
            } else if (nz == -1) {
                shuffled = [x, y, z];
            }

            return shuffled;
        }

    };

    return star;
});
