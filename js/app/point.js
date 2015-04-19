define(function () {

    var point = function (parent, xyz, project, renderContext) {
        this.project = project;
        this.xo = xyz[0];
        this.yo = xyz[1];
        this.zo = xyz[2];
        this.cube = parent;
        this.renderContext = renderContext;
    };

    point.prototype = {

        projection: function () {
            // ---- 3D rotation ----
            var x = this.renderContext.camera.cosY *
                (this.renderContext.camera.sinZ * this.yo + this.renderContext.camera.cosZ * this.xo) - this.renderContext.camera.sinY * this.zo;
            var y = this.renderContext.camera.sinX *
                (this.renderContext.camera.cosY * this.zo + this.renderContext.camera.sinY * (this.renderContext.camera.sinZ * this.yo + this.renderContext.camera.cosZ * this.xo)) + this.renderContext.camera.cosX * (this.renderContext.camera.cosZ * this.yo - this.renderContext.camera.sinZ * this.xo);
            var z = this.renderContext.camera.cosX *
                (this.renderContext.camera.cosY * this.zo + this.renderContext.camera.sinY * (this.renderContext.camera.sinZ * this.yo + this.renderContext.camera.cosZ * this.xo)) - this.renderContext.camera.sinX * (this.renderContext.camera.cosZ * this.yo - this.renderContext.camera.sinZ * this.xo);
            this.x = x;
            this.y = y;
            this.z = z;
            if (this.project) {
                // ---- point visible ----
                if (z < this.renderContext.camera.minZ) this.renderContext.camera.minZ = z;
                this.visible = (this.renderContext.camera.zoom + z > 0);
                // ---- 3D to 2D projection ----
                this.X = (this.renderContext.screen.nw * 0.5) + x * (this.renderContext.camera.fl / (z + this.renderContext.camera.zoom));
                this.Y = (this.renderContext.screen.nh * 0.5) + y * (this.renderContext.camera.fl / (z + this.renderContext.camera.zoom));
            }
        }

    };

    return point;
});