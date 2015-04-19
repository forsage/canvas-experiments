define(function (require) {

    var Point = require("../app/point");
    var Face = require("../app/face");

    var cube = function (parent, nx, ny, nz, x, y, z, w, renderContext, renderedObjects, renderCoords, renderConfig) {
        this.renderContext = renderContext;
        this.renderedObjects = renderedObjects;
        this.renderCoords = renderCoords;
        this.renderConfig = renderConfig;

        if (parent) {
            // ---- translate parent points ----
            this.w = parent.w;
            this.points = [];
            var i = 0, p;
            while (p = parent.points[i++]) {
                this.points.push(
                    new Point(
                        parent,
                        [p.xo + nx, p.yo + ny, p.zo + nz],
                        true,
                        this.renderContext
                    )
                );
            }
        } else {
            // ---- create points ----
            this.w = w;
            this.points = [];
            var p = [
                [x - w, y - w, z - w],
                [x + w, y - w, z - w],
                [x + w, y + w, z - w],
                [x - w, y + w, z - w],
                [x - w, y - w, z + w],
                [x + w, y - w, z + w],
                [x + w, y + w, z + w],
                [x - w, y + w, z + w]
            ];
            for (var i in p) this.points.push(
                new Point(this, p[i], true, this.renderContext)
            );
        }
        // ---- faces coordinates ----
        var f = [
            [0, 1, 2, 3],
            [0, 4, 5, 1],
            [3, 2, 6, 7],
            [0, 3, 7, 4],
            [1, 5, 6, 2],
            [5, 4, 7, 6]
        ];
        // ---- faces normals ----
        var nv = [
            [0, 0, 1],
            [0, 1, 0],
            [0, -1, 0],
            [1, 0, 0],
            [-1, 0, 0],
            [0, 0, -1]
        ];
        // ---- cube transparency ----
        this.alpha = this.renderConfig.alpha ? 0.5 : 1;
        // ---- push faces ----
        for (var i in f) {
            this.renderedObjects.faces.push(
                new Face(this, f[i], nv[i], true, this.renderContext, this.renderedObjects, this.renderCoords, this.renderConfig)
            );
        }
        this.renderedObjects.nCube++;
    };

    return cube;
});
