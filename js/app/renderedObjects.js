define(function () {

    var renderedObjects = function () {
        this.reset();
    };

    renderedObjects.prototype = {

        reset: function () {
            this.cubes = [];
            this.faces = [];
            this.nCube = 0;
            this.nPoly = 0;
        }

    };

    return renderedObjects;
});
