define(function () {

    var canvas = function (id) {
        this.container = document.getElementById(id);
        this.ctx = this.container.getContext("2d");
    };

    canvas.prototype = {

        resize: function (w, h) {
            this.container.width = w;
            this.container.height = h;
        }

    };

    return canvas;
});