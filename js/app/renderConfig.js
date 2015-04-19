define(function () {

    var renderConfig = function () {
        this.white = false;
        this.alpha = false;
        this.fps = 0;
        this.faceOver = false;
        this.drag = false;
        this.moved = false;
        this.bkgColor1 = "rgba(0,0,0,0.1)";
        this.bkgColor2 = "rgba(32,32,32,1)";
        this.autorotate = false;
        this.destroy = false;
        this.running = true;
        this.framesOnly = false;
        this.nStarEdges = 7;
    };

    return renderConfig;
});
