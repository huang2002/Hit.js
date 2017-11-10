/**
 * @file Hit.Canvas.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 * @overview This file defined some new methods on CanvasRenderingContext2D.prototype so that you can get more functions from Canvas.
 */

Loop.each({
    /**
     * @description To apply mosaic to rect(x, y, w, h);
     * @param {number} x The x.
     * @param {number} y The y.
     * @param {number} w The w.
     * @param {number} h The h.
     * @param {number} size The size of mosaic. (Default: 10)
     * @returns {undefined}
     */
    mosaic: function (x, y, w, h, size) {
        if (arguments.length <= 1) {
            var canvas = this.canvas;
            return this.mosaic(0, 0, canvas.width, canvas.width, arguments[0]);
        }
        if (typeof size !== 'number' || size <= 0) {
            size = 10;
        }
        var imgData = this.getImageData(x, y, w, h),
            data = imgData.data,
            rw = Math.ceil(w / size),
            rh = Math.ceil(h / size);
        for (var i = 0; i < rw; i++) {
            var rx = i * size;
            for (var j = 0; j < rh; j++) {
                var ry = j * size,
                    r = 0,
                    g = 0,
                    b = 0,
                    a = 0,
                    count = 0,
                    p, k, px, py, offset;
                for (p = 0; p < size; p++) {
                    px = rx + p;
                    if (px > w) {
                        continue;
                    }
                    for (k = 0; k < size; k++) {
                        py = ry + k;
                        if (py > h) {
                            continue;
                        }
                        offset = (px * w + py) * 4;
                        r += data[offset];
                        g += data[offset + 1];
                        b += data[offset + 2];
                        a += data[offset + 3];
                        count++;
                    }
                }
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);
                a = Math.round(a / count);
                for (p = 0; p < size; p++) {
                    px = rx + p;
                    if (px > w) {
                        continue;
                    }
                    for (k = 0; k < size; k++) {
                        py = ry + k;
                        if (py > h) {
                            continue;
                        }
                        offset = (px * w + py) * 4;
                        data[offset] = r;
                        data[offset + 1] = g;
                        data[offset + 2] = b;
                        data[offset + 3] = a;
                    }
                }
            }
        }
        this.putImageData(imgData, x, y);
    }
}, function (v, k) {
    CanvasRenderingContext2D.prototype[k] = v;
});