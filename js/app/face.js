define(function (require) {

    var Point = require("../app/point");
    var Star = require("../app/star");

    var face = function (cube, index, normalVector, hasStar, renderContext, renderedObjects, renderCoords, renderConfig) {
        // ---- parent cube ----
        this.cube = cube;
        this.renderContext = renderContext;
        this.renderedObjects = renderedObjects;
        this.renderCoords = renderCoords;
        this.renderConfig = renderConfig;
        // ---- coordinates ----
        this.p0 = cube.points[index[0]];
        this.p1 = cube.points[index[1]];
        this.p2 = cube.points[index[2]];
        this.p3 = cube.points[index[3]];
        // ---- normal vector ----
        this.normal = new Point(this, normalVector, false, this.renderContext);
        // ---- star ----
        var xoAvg = (this.p0.xo + this.p1.xo + this.p2.xo + this.p3.xo) / 4;
        var yoAvg = (this.p0.yo + this.p1.yo + this.p2.yo + this.p3.yo) / 4;
        var zoAvg = (this.p0.zo + this.p1.zo + this.p2.zo + this.p3.zo) / 4;
        if (hasStar) {
            this.star = new Star(xoAvg, yoAvg, zoAvg, this.renderConfig.nStarEdges, 30, cube, normalVector, this.renderContext);
        }
        // ---- # faces ----
        this.renderedObjects.nPoly++;
        document.getElementById('npoly').innerHTML = this.renderedObjects.nPoly.toString();
    };

    face.prototype = {

        pointerInside: function () {
            // ---- Is Point Inside Triangle? ----
            // http://2000clicks.com/mathhelp/GeometryPointAndTriangle2.aspx
            var fAB = function (p1, p2, p3) {
                return (this.renderCoords.ym - p1.Y) * (p2.X - p1.X) - (this.renderCoords.xm - p1.X) * (p2.Y - p1.Y);
            };
            var fCA = function (p1, p2, p3) {
                return (this.renderCoords.ym - p3.Y) * (p1.X - p3.X) - (this.renderCoords.xm - p3.X) * (p1.Y - p3.Y);
            };
            var fBC = function (p1, p2, p3) {
                return (this.renderCoords.ym - p2.Y) * (p3.X - p2.X) - (this.renderCoords.xm - p2.X) * (p3.Y - p2.Y);
            };
            if (
                fAB.call(this, this.p0, this.p1, this.p3) * fBC.call(this, this.p0, this.p1, this.p3) > 0 &&
                fBC.call(this, this.p0, this.p1, this.p3) * fCA.call(this, this.p0, this.p1, this.p3) > 0
            ) {
                return true;
            }
            if (
                fAB.call(this, this.p1, this.p2, this.p3) * fBC.call(this, this.p1, this.p2, this.p3) > 0 &&
                fBC.call(this, this.p1, this.p2, this.p3) * fCA.call(this, this.p1, this.p2, this.p3) > 0
            ) {
                return true;
            }
            // ----
            return false;
        },

        faceVisible: function () {
            if (this.renderConfig.framesOnly) {
                this.visible = true;
                return true;
            }
            // ---- points visible ----
            if (this.p0.visible && this.p1.visible && this.p2.visible && this.p3.visible) {
                // ---- back face culling ----
                if ((this.p1.Y - this.p0.Y) / (this.p1.X - this.p0.X) < (this.p2.Y - this.p0.Y) / (this.p2.X - this.p0.X) ^ this.p0.X < this.p1.X == this.p0.X > this.p2.X) {
                    // ---- face visible ----
                    this.visible = true;
                    return true;
                }
            }
            // ---- face hidden ----
            this.visible = false;
            this.distance = -99999;
            return false;
        },

        distanceToCamera: function () {
            // ---- distance to camera ----
            var dx = (this.p0.x + this.p1.x + this.p2.x + this.p3.x ) * 0.25;
            var dy = (this.p0.y + this.p1.y + this.p2.y + this.p3.y ) * 0.25;
            var dz = (this.renderContext.camera.zoom + this.renderContext.camera.fl) + (this.p0.z + this.p1.z + this.p2.z + this.p3.z ) * 0.25;
            this.distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        },

        draw: function () {
            // ---- flat (lambert) shading ----
            this.normal.projection();
            var light = calculateLight.call(this);

            function calculateLight() {
                if (this.renderConfig.white) {
                    return (this.normal.y + this.normal.z * 0.5) * 256;
                }

                return this.normal.z * 256;
            }

            // ---- light ----
            var r = 256;
            var g = 256;
            var b = 256;
            if (this == this.renderConfig.faceOver) {
                r = 256;
                g = 256;
                b = 256;
            } else {
                if (Math.abs(this.normal.xo) == 1) {
                    r = light;
                    g = b = 0;
                }
                if (Math.abs(this.normal.yo) == 1) {
                    g = light;
                    r = b = 0;
                }
                if (Math.abs(this.normal.zo) == 1) {
                    b = light;
                    r = g = 0;
                }
            }
            // ---- shape face ----
            if (this.renderConfig.framesOnly) {
                if (this != this.renderConfig.faceOver) {
                    var absLight = Math.abs(Math.round(light));
                    r = absLight;
                    g = absLight;
                    b = absLight;
                }
                this.renderContext.canvas.ctx.beginPath();
                this.renderContext.canvas.ctx.moveTo(this.p0.X, this.p0.Y);
                this.renderContext.canvas.ctx.lineTo(this.p1.X, this.p1.Y);
                this.renderContext.canvas.ctx.lineTo(this.p2.X, this.p2.Y);
                this.renderContext.canvas.ctx.lineTo(this.p3.X, this.p3.Y);
                this.renderContext.canvas.ctx.lineTo(this.p0.X, this.p0.Y);
                this.renderContext.canvas.ctx.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + this.cube.alpha + ")";
                this.renderContext.canvas.ctx.stroke();
                if (this == this.renderConfig.faceOver) {
                    this.renderContext.canvas.ctx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + this.cube.alpha + ")";
                    this.renderContext.canvas.ctx.fill();
                }
                this.renderContext.canvas.ctx.closePath();
                return;
            }

            // ---- fill ----
            this.renderContext.canvas.ctx.fillStyle = "rgba(" +
            Math.round(r) + "," +
            Math.round(g) + "," +
            Math.round(b) + "," + this.cube.alpha + ")";

            this.renderContext.canvas.ctx.beginPath();
            if (this.star != null) {
                this.star.draw();
                this.renderContext.canvas.ctx.fill();
            } else {
                this.renderContext.canvas.ctx.moveTo(this.p0.X, this.p0.Y);
                this.renderContext.canvas.ctx.lineTo(this.p1.X, this.p1.Y);
                this.renderContext.canvas.ctx.lineTo(this.p2.X, this.p2.Y);
                this.renderContext.canvas.ctx.lineTo(this.p3.X, this.p3.Y);
                this.renderContext.canvas.ctx.lineTo(this.p0.X, this.p0.Y);
            }
            this.renderContext.canvas.ctx.closePath();
        }

    };

    return face;
});
