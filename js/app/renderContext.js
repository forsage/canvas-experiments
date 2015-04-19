define(function (require) {

    var Canvas = require("../app/canvas");
    var Camera = require("../app/camera");
    var Screen = require("../app/screen");

    var renderContext = function () {
        this.canvas = new Canvas("canvas");
        this.camera = new Camera();
        this.screen = new Screen();
        this.scr = document.getElementById("screen");
    };

    return renderContext;
});
