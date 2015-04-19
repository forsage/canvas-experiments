define(function () {

    var renderCoords = function () {
        this.xm = 0;
        this.ym = 0;
        this.cxb = 0;
        this.cyb = 0;
        this.startX = 0;
        this.startY = 0;

        this.reset();
    };

    renderCoords.prototype = {

        reset: function () {
            this.cx = 50;
            this.cy = 50;
            this.cz = 0;
        }

    };

    return renderCoords;
});
