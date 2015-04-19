define(function () {

    var camera = function () {
        this.sinX = 0;
        this.sinY = 0;
        this.sinZ = 0;
        this.cosX = 0;
        this.cosY = 0;
        this.cosZ = 0;
        this.angleY = 0;
        this.angleX = 0;
        this.angleZ = 0;
        this.minZ = 0;
        this.zoom = 0;
        this.fl = 250;
    };

    camera.prototype = {

        rotate: function (cx, cy, cz) {
            this.angleX += ((cy - this.angleX) * 0.05);
            this.angleY += ((cx - this.angleY) * 0.05);
            this.angleZ += ((cz - this.angleZ) * 0.05);
        },

        precalcTrigo: function() {
            this.cosY = Math.cos(this.angleY * 0.01);
            this.sinY = Math.sin(this.angleY * 0.01);
            this.cosX = Math.cos(this.angleX * 0.01);
            this.sinX = Math.sin(this.angleX * 0.01);
            this.cosZ = Math.cos(this.angleZ * 0.01);
            this.sinZ = Math.sin(this.angleZ * 0.01);
        },

        adaptZoom: function () {
            var d = -this.minZ + 100 - this.zoom;
            this.zoom += (d * ((d > 0) ? 0.05 : 0.01));
        }

    };

    return camera;
});