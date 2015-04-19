// =============================================================
//           ===== CANVAS 3D experiment =====
//     ===== simple 3D cubes HTML5 engine ====
// script written by Gerard Ferrandez - January 2, 2012
// http://www.dhteumeuleu.com
// =============================================================

"use strict";

define(function (require) {

    var Cube = require("../app/cube");
    var RenderContext = require("../app/renderContext");
    var RenderedOjects = require("../app/renderedObjects");
    var RenderCoords = require("../app/renderCoords");
    var RenderConfig = require("../app/renderConfig");

    var renderContext = new RenderContext();
    var renderedObjects = new RenderedOjects();
    var renderCoords = new RenderCoords();
    var renderConfig = new RenderConfig();

    var resize = function () {
        // ---- screen resize ----
        renderContext.screen.nw = renderContext.scr.offsetWidth;
        renderContext.screen.nh = renderContext.scr.offsetHeight;
        var o = renderContext.scr;
        for (renderContext.screen.nx = 0, renderContext.screen.ny = 0; o != null; o = o.offsetParent) {
            renderContext.screen.nx += o.offsetLeft;
            renderContext.screen.ny += o.offsetTop;
        }
        renderContext.canvas.resize(renderContext.screen.nw, renderContext.screen.nh);
    };
    var reset = function () {
        renderCoords.reset();
        renderedObjects.reset();
        document.getElementById("framesOnly").checked = renderConfig.framesOnly = false;
        document.getElementById("nStarEdges").value = renderConfig.nStarEdges = 7;
        // ---- create first cube ----
        renderedObjects.cubes.push(
            new Cube(false, 0, 0, 0, 0, 0, 0, 50, renderContext, renderedObjects, renderCoords, renderConfig)
        );
    };
    var detectFaceOver = function () {
        // ---- detect pointer over face ----
        var j = 0, f;
        renderConfig.faceOver = false;
        while (f = renderedObjects.faces[j++]) {
            if (f.visible) {
                if (f.pointerInside()) {
                    renderConfig.faceOver = f;
                }
            } else break;
        }
    };
    var click = function () {
        // ---- click cube ----
        detectFaceOver();
        if (renderConfig.faceOver) {
            if (renderConfig.destroy) {
                if (renderedObjects.nCube > 1) {
                    var c = renderConfig.faceOver.cube;
                    renderConfig.faceOver.clicked = false;
                    // ---- destroy faces ----
                    var i = 0, f;
                    while (f = renderedObjects.faces[i++]) {
                        if (f.cube == c) {
                            renderedObjects.faces.splice(--i, 1);
                            renderedObjects.nPoly--;
                        }
                    }
                    document.getElementById('npoly').innerHTML = renderedObjects.nPoly.toString();
                    // ---- destroy cube ----
                    var i = 0, o;
                    while (o = renderedObjects.cubes[i++]) {
                        if (o == c) {
                            renderedObjects.cubes.splice(--i, 1);
                            renderedObjects.nCube--;
                            break;
                        }
                    }
                }
            } else {
                if (!renderConfig.faceOver.clicked) {
                    renderConfig.faceOver.clicked = true;
                    var w = -2 * renderConfig.faceOver.cube.w;
                    renderedObjects.cubes.push(
                        new Cube(
                            renderConfig.faceOver.cube,
                            w * renderConfig.faceOver.normal.xo,
                            w * renderConfig.faceOver.normal.yo,
                            w * renderConfig.faceOver.normal.zo,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            renderContext,
                            renderedObjects,
                            renderCoords,
                            renderConfig
                        )
                    );
                    detectFaceOver();
                }
            }
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    var init = function () {
        // ======== unified touch/mouse events handler ========
        renderContext.scr.ontouchstart = renderContext.scr.onmousedown = function (e) {

            if (!renderConfig.running) return true;
            // ---- touchstart ----
            if (e.target !== renderContext.canvas.container) return;
            e.preventDefault(); // prevents scrolling
            if (renderContext.scr.setCapture) renderContext.scr.setCapture();
            renderConfig.moved = false;
            renderConfig.drag = true;
            renderCoords.startX = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - renderContext.screen.nx;
            renderCoords.startY = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY) - renderContext.screen.ny;
            document.getElementById("cmove").removeAttribute("style");
        };
        renderContext.scr.ontouchmove = renderContext.scr.onmousemove = function (e) {
            if (!renderConfig.running) return true;
            // ---- touchmove ----
            e.preventDefault();
            renderCoords.xm = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - renderContext.screen.nx;
            renderCoords.ym = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY) - renderContext.screen.ny;
            detectFaceOver();
            if (renderConfig.drag) {
                renderCoords.cx = renderCoords.cxb + (renderCoords.xm - renderCoords.startX);
                renderCoords.cy = renderCoords.cyb - (renderCoords.ym - renderCoords.startY);
                document.getElementById("cmove").innerHTML = renderCoords.cx + ", " + renderCoords.cy;
            }
            if (Math.abs(renderCoords.xm - renderCoords.startX) > 10 || Math.abs(renderCoords.ym - renderCoords.startY) > 10) {
                // ---- if pointer moves then cancel the tap/click ----
                renderConfig.moved = true;
            }
        };
        renderContext.scr.ontouchend = renderContext.scr.onmouseup = function (e) {
            if (!renderConfig.running) return true;
            // ---- touchend ----
            e.preventDefault();
            if (renderContext.scr.releaseCapture) renderContext.scr.releaseCapture();
            renderConfig.drag = false;
            renderCoords.cxb = renderCoords.cx;
            renderCoords.cyb = renderCoords.cy;
            if (!renderConfig.moved) {
                // ---- click/tap ----
                renderCoords.xm = renderCoords.startX;
                renderCoords.ym = renderCoords.startY;
                click();
            }
            document.getElementById("cmove").setAttribute("style", "display: none;");
        };
        renderContext.scr.ontouchcancel = function (e) {
            if (!renderConfig.running) return true;
            // ---- reset ----
            if (renderContext.scr.releaseCapture) renderContext.scr.releaseCapture();
            renderConfig.moved = false;
            renderConfig.drag = false;
            renderCoords.cxb = renderCoords.cx;
            renderCoords.cyb = renderCoords.cy;
            renderCoords.startX = 0;
            renderCoords.startY = 0;
            document.getElementById("cmove").setAttribute("style", "display: none;");
        };
        // ---- Z axis rotation (mouse wheel) ----
        renderContext.scr.addEventListener('DOMMouseScroll', function (e) {
            if (!renderConfig.running) return true;
            renderCoords.cz += e.detail * 12;
            return false;
        }, false);
        renderContext.scr.onmousewheel = function () {
            if (!renderConfig.running) return true;
            renderCoords.cz += event.wheelDelta / 5;
            return false;
        };
        // ---- multi-touch gestures ----
        document.addEventListener('gesturechange', function (e) {
            if (!renderConfig.running) return true;
            e.preventDefault();
            // ---- Z axis rotation ----
            renderCoords.cz = event.rotation;
        }, false);
        // ---- screen size ----
        resize();
        window.addEventListener('resize', resize, false);
        // ---- fps count ----
        setInterval(function () {
            document.getElementById('fps').innerHTML = (renderConfig.fps * 2).toString();
            renderConfig.fps = 0;
        }, 500); // update every 1/2 seconds
        // ---- camera angle ----
        setInterval(function () {
            document.getElementById('cangle').innerHTML = renderContext.camera.angleX.toFixed(0) + ', ' + renderContext.camera.angleY.toFixed(0) + ', ' + renderContext.camera.angleZ.toFixed(0);
        }, 16); // update every 1/60 seconds
        // ---- some UI options ----
        document.getElementById("white").onchange = function () {
            renderConfig.white = this.checked;
            if (renderConfig.white) {
                renderConfig.bkgColor1 = "rgba(256,256,256,0.1)";
                renderConfig.bkgColor2 = "rgba(192,192,192,1)";
            } else {
                renderConfig.bkgColor1 = "rgba(0,0,0,0.1)";
                renderConfig.bkgColor2 = "rgba(32,32,32,1)";
            }
        };
        document.getElementById("alpha").onchange = function () {
            renderConfig.alpha = this.checked;
        };
        document.getElementById("autor").onchange = function () {
            renderConfig.autorotate = this.checked;
        };
        document.getElementById("destroy").onchange = function () {
            renderConfig.destroy = this.checked;
        };
        document.getElementById("framesOnly").onchange = function () {
            renderConfig.framesOnly = this.checked;
        };
        document.getElementById("nStarEdges").onchange = function () {
            var intValue = parseInt(this.value);
            if (isNaN(intValue)) {
                intValue = 7;
            }
            if (intValue < 2) {
                intValue = 2;
            }
            if (intValue > 25) {
                intValue = 25;
            }
            renderConfig.nStarEdges = this.value = intValue;
        };
        document.getElementById("stopgo").onclick = function () {
            renderConfig.running = !renderConfig.running;
            document.getElementById("stopgo").value = renderConfig.running ? "STOP" : "GO!";
            if (renderConfig.running) run();
        };
        document.getElementById("reset").onclick = function () {
            reset();
        };
        // ---- engine start ----
        reset();
        run();
    };
    ////////////////////////////////////////////////////////////////////////////
    // ======== main loop ========
    var run = function () {
        // ---- screen background ----
        renderContext.canvas.ctx.fillStyle = renderConfig.bkgColor1;
        renderContext.canvas.ctx.fillRect(0, Math.floor(renderContext.screen.nh * 0.15), renderContext.screen.nw, Math.ceil(renderContext.screen.nh * 0.7));
        renderContext.canvas.ctx.fillStyle = renderConfig.bkgColor2;
        renderContext.canvas.ctx.fillRect(0, 0, renderContext.screen.nw, Math.ceil(renderContext.screen.nh * 0.15));
        renderContext.canvas.ctx.fillStyle = renderConfig.bkgColor2;
        renderContext.canvas.ctx.fillRect(0, Math.floor(renderContext.screen.nh * 0.85), renderContext.screen.nw, Math.ceil(renderContext.screen.nh * 0.15));
        // ---- easing rotations ----
        renderContext.camera.rotate(renderCoords.cx, renderCoords.cy, renderCoords.cz);
        if (renderConfig.autorotate) renderCoords.cz += 1;
        // ---- pre-calculating trigo ----
        renderContext.camera.precalcTrigo();
        // ---- points projection ----
        renderContext.camera.minZ = 0;
        var i = 0, c;
        while (c = renderedObjects.cubes[i++]) {
            var j = 0, p;
            while (p = c.points[j++]) {
                p.projection();
            }
        }
        // ---- adapt zoom ----
        renderContext.camera.adaptZoom();
        // ---- faces light ----
        var j = 0, f;
        while (f = renderedObjects.faces[j++]) {
            if (f.faceVisible()) {
                f.distanceToCamera();
            }
        }
        // ---- faces depth sorting ----
        renderedObjects.faces.sort(function (p0, p1) {
            return p1.distance - p0.distance;
        });
        // ---- painting faces ----
        j = 0;
        while (f = renderedObjects.faces[j++]) {
            if (f.visible) {
                f.draw();
            } else break;
        }
        // ---- animation loop ----
        renderConfig.fps++;
        if (renderConfig.running) setTimeout(run, 16);
    };

    return {

        render: function () {
            init();
        }

    }
});
