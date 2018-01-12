/**
 * @file Hit.Game.js
 * @see https://github.com/huang2002/Hit.js
 * @requires OC.js (https://github.com/huang2002/ObjectiveCanvas.js)
 * @author hhh
 * @overview This file defined some constructors about 2D games, and you can use them to make you 2D games.
 */

if (!('OC' in window)) {
    throw new Error('Please load OC.js first!');
}

/**
 * @description The constructor of scenes.
 * @property {Array<OC.Object>} items The items.
 * @property {string} bg The background fillStyle.
 * @property {number} fps The fps of the scene.
 * @method listen To listen events of the scene.
 * @method listenOnce To listen events of the scene once.
 * @method ignore To ignore listener of the scene.
 * @method ignoreType To ignore all the listener of the scene match the type.
 * @method ignoreAll To ignore all the listener of the scene.
 */
Extension.export('Game-Scene',
    new Constructor(
        function () {
            this._agency = new Agency();
            this._agency.bind(this);
            this.items = [];
            this.bg = null;
            this.fps = null;
        }, {
            /**
             * @description To add an item.
             * @param {OC.Object} item The item.
             * @returns {Scene} Self.
             */
            add: function (item) {
                this.items.push(item);
                return this;
            },
            /**
             * @description To remove an item.
             * @param {OC.Object} item The item.
             * @returns {Scene} Self.
             */
            remove: function (item) {
                this.items = Loop.filter(this.items, function (i) {
                    return i !== item;
                });
                return this;
            },
            /**
             * @description To render the background of the scene.
             * @param {CanvasRenderingContext2D} ctx The context.
             * @param {UI} UI The UI.
             */
            drawBg: function (ctx, UI) {
                if (this.bg && UI) {
                    ctx.save();
                    ctx.fillStyle = this.bg;
                    ctx.fillRect(0, 0, UI.width, UI.height);
                    ctx.restore();
                }
            },
            /**
             * @description To render the scene.
             * @param {CanvasRenderingContext2D} ctx The context.
             */
            draw: function (ctx) {
                Loop.each(this.items, function (item) {
                    if ('draw' in item) {
                        item.draw(ctx);
                    }
                });
            }
        }
    )
);

/**
 * @description The constructor of controllers.
 * @property {Ani.Frame} frame The main frame.
 * @property {Scene} scene The scene that is being rendered.
 * @method listenType(type:string) To let the controller listen a new type so that the items in the scene will be able to listen the events of that type.
 */
Extension.export('Game-Controller',
    new Constructor(
        function (game) {
            if (!game) {
                return null;
            }
            this.frame = new Ani.Frame();
            this.scene = null;
            var self = this;
            this.frame.listen('update', function () {
                if (!self.scene) {
                    return;
                }
                var ctx = game.context,
                    UI = game.UI,
                    scene = self.scene;
                if (scene.fps > 0) {
                    self.frame.fps = scene.fps;
                }
                scene.drawBg(ctx, UI);
                scene._agency.trigger('update');
                scene.draw(ctx);
            });
            this.listenType = function (type) {
                window.listen(type, function (e) {
                    if (!self.frame.isRunning) {
                        return;
                    }
                    var pos = 'touches' in e ? e.touches[0] : e,
                        x = game.UI.toGameX(pos.clientX),
                        y = game.UI.toGameY(pos.clientY),
                        scene = self.scene;
                    scene._agency.trigger(type, [e]);
                    Loop.each(scene.items, function (item) {
                        if ('_agency' in item && 'isPointInPath' in item && item.isPointInPath(x, y)) {
                            item._agency.trigger(type, [e]);
                        }
                    });
                });
            };
            // default listening type(s)
            this.listenType('click');
        }, {
            /**
             * @description To start rendering a scene.
             * @param {Scene} scene The scene.
             * @returns {Controller} Self.
             */
            start: function (scene) {
                if (scene) {
                    if (this.scene) {
                        this.scene._agency.trigger('exit');
                    }
                    this.scene = scene;
                    this.scene._agency.trigger('enter');
                }
                if (!this.frame.isRunning) {
                    this.frame.start();
                }
                return this;
            },
            /**
             * @description To stop rendering the scene.
             * @returns {Controller} Self.
             */
            stop: function () {
                this.frame.stop();
                return this;
            },
            /**
             * @description To start rendering a scene gotten from Extension.import(name).
             * @param {string} name The name used when exporting the scene.
             * @returns {Controller} Self.
             */
            direct: function (name) {
                return this.start(Extension.import(name));
            }
        }
    )
);

/**
 * @description The constructor of game UI.
 * @property {number} width The width of the view.
 * @property {number} height The height of the view.
 * @property {number} left The left of the view.
 * @property {number} right The right of the view.
 * @property {number} top The top of the view.
 * @property {number} bottom The bottom of the view.
 * @property {number} cx The center of x of the view.
 * @property {number} cy The center of y of the view.
 * @property {number} padding The padding of the view.
 * @method toGameX(x:number) To convert the global position to game position.
 * @method toGameY(y:number) To convert the global position to game position.
 * @method toGamePos(pos) To convert the global position to game position.
 */
Extension.export('Game-UI',
    new Constructor(
        function (game) {
            this.width = 960;
            this.height = 640;
            this.padding = 5;
            Object.defineProperties(this, {
                left: {
                    get: function () {
                        return 0;
                    }
                },
                top: {
                    get: function () {
                        return 0;
                    }
                },
                right: {
                    get: function () {
                        return this.width;
                    }
                },
                bottom: {
                    get: function () {
                        return this.height;
                    }
                },
                cx: {
                    get: function () {
                        return this.width / 2;
                    }
                },
                cy: {
                    get: function () {
                        return this.height / 2;
                    }
                }
            });
            var canvas = game._canvas;
            this.toGameX = function (x) {
                var rect = canvas.getBoundingClientRect();
                return (x - rect.left) / rect.width * this.width;
            };
            this.toGameY = function (y) {
                var rect = canvas.getBoundingClientRect();
                return (y - rect.top) / rect.height * this.height;
            };
        }, {
            toGamePos: function (pos) {
                return {
                    x: this.toGameX(pos.x),
                    y: this.toGameY(pos.y)
                };
            }
        }
    )
);

/**
 * @description The constructor of game managers.
 * @property {Controller} controller The controller of the game.
 */
Extension.define('Game', [
    'Game-Controller',
    'Game-UI'
], function (Controller, UI) {
    var Game = new Constructor(
        function () {
            this._canvas = DOM.create('canvas.game');
            this.context = this._canvas.getContext('2d');
            this.controller = new Controller(this);
            this.UI = new UI(this);
        }, {
            /**
             * @description To init the game.
             * @param {{method: Function, width: number, height: number, padding: number}} config The configuration.
             * @returns {Game} Self.
             */
            init: function (config) {
                try {
                    config = config || {};
                    if (config.width > 0) {
                        this.UI.width = config.width;
                    }
                    if (config.height > 0) {
                        this.UI.height = config.height;
                    }
                    if (config.padding > 0) {
                        this.UI.padding = config.padding;
                    }
                    if (!('method' in config)) {
                        config.method = Game.FIXED;
                    }
                    var canvas = this._canvas,
                        ratio = window.devicePixelRatio || 1;
                    var justify = function () {
                        var ans = config.method(this.UI);
                        canvas.width = this.UI.width * ratio;
                        canvas.height = this.UI.height * ratio;
                        canvas.css('margin-left', ans.left + 'px');
                        canvas.css('margin-top', ans.top + 'px');
                        canvas.css('width', ans.width + 'px');
                        canvas.css('height', ans.height + 'px');
                        this.context.scale(ratio, ratio);
                    }.bind(this);
                    justify();
                    if (config.autoResize !== false) {
                        window.listen('resize', justify);
                        window.listen('orientationchange', justify);
                    }
                    document.body.appendChild(canvas)
                } catch (err) {
                    console.error(err);
                    return false;
                }
                return true;
            }
        }
    );
    // initializing methods (To tell how the canvas should be displayed.)
    Loop.each({
        // Will scale the canvas to fit the window.
        FIXED: function (UI) {
            var W = window.innerWidth,
                H = window.innerHeight,
                w = UI.width,
                h = UI.height,
                p = UI.padding,
                ans = {},
                scale = null;
            if (W / H > w / h) {
                ans.height = H - p * 2;
                ans.top = p;
                scale = ans.height / h;
                ans.width = w * scale;
                ans.left = W / 2 - ans.width / 2;
            } else {
                ans.width = W - p * 2;
                ans.left = p;
                scale = ans.width / w;
                ans.height = h * scale;
                ans.top = H / 2 - ans.height / 2;
            }
            return ans;
        },
        // Will fix the height to fit the window.
        FIXED_HEIGHT: function (UI) {
            var W = window.innerWidth,
                H = window.innerHeight,
                h = UI.height,
                p = UI.padding,
                ans = {},
                scale = null;
            ans.height = H - p * 2;
            ans.top = p;
            scale = ans.height / h;
            ans.width = W - p * 2;
            UI.width = ans.width / scale;
            ans.left = p;
            return ans;
        },
        // Will fix the width to fit the window.
        FIXED_WIDTH: function (UI) {
            var W = window.innerWidth,
                H = window.innerHeight,
                w = UI.width,
                p = UI.padding,
                ans = {},
                scale = null;
            ans.width = W - p * 2;
            ans.left = p;
            scale = ans.width / w;
            ans.height = H - p * 2;
            UI.height = ans.height / scale;
            ans.top = p;
            return ans;
        },
        // Will justify the canvas without scaling.
        MIN: function (UI) {
            return {
                width: UI.width,
                height: UI.height,
                left: window.innerWidth / 2 - UI.width / 2,
                top: window.innerHeight / 2 - UI.height / 2
            };
        },
        // Will make the canvas cover the window.
        MAX: function (UI) {
            UI.width = window.innerWidth - UI.padding * 2
            UI.height = window.innerHeight - UI.padding * 2
            return {
                left: UI.padding,
                top: UI.padding,
                width: UI.width,
                height: UI.height
            };
        }
    }, function (method, name) {
        Game[name] = method;
    });
    return Game;
});
