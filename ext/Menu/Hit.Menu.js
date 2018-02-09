/**
 * @file Hit.Menu.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 * @overview This file defined a constructor called 'Menu', and you can use it to create menus easily.
 */
Extension.define('Menu', [], function () {
    "use strict";

    var win = window,
        DOM = win.DOM;

    /**
     * @typedef {(e: Event) => void} ClickCallback The click event callbacks.
     */

    function preventCtx(ele) {
        ele.listen('contextmenu', function (e) {
            e.preventDefault();
        }, { passive: false });
    }

    /**
     * @description The constructor of menus.
     * @param {string} id [optional] The id of the element of that menu.
     */
    var Menu = new Constructor(
        function (id) {
            var str = 'div';
            if (typeof id === 'string') {
                str += '#' + id;
            }
            str += '.menu';
            this.ele = DOM.create(str).hide();
            preventCtx(this.ele);
            this.items = [];
            var self = this;
            layer.appendChild(this.ele);
        }, {
            /**
             * @description To add an item to the menu.
             * @param {string} text The text to display.
             * @param {ClickCallback} callback The click callback.
             * @returns {Menu} The menu itself.
             */
            add: function (text, callback) {
                var item = new Item(text, callback);
                this.items.push(item);
                this.ele.appendChild(item.ele);
                return this;
            },
            /**
             * @description To remove the item at the index.
             * @param {number} index The index of that item.
             * @returns {Menu} The menu itself.
             */
            delIndex: function (index) {
                var items = this.items,
                    item = items[index];
                if (item) {
                    items.delIndex(index);
                    this.ele.removeChild(item.ele);
                }
                return this;
            },
            /**
             * @description To show the menu. (The position should be fixed.)
             * @param {number} x Where to show the menu.
             * @param {number} y Where to show the menu.
             * @returns {Menu} The menu itself.
             */
            show: function (x, y) {
                curMenu = this;
                var ele = this.ele;
                ele.show();
                layer.show();
                ele.css('left', x + 'px');
                ele.css('top', y + 'px');
                var b = ele.getBoundingClientRect();
                if (b.right + b.with + 10 >= win.innerWidth) {
                    ele.addClass('left');
                } else {
                    ele.delClass('left');
                }
                if (b.bottom + b.height + 10 >= win.innerHeight) {
                    ele.addClass('top');
                } else {
                    ele.delClass('top');
                }
                return this;
            },
            /**
             * @description To hide the menu.
             * @returns {Menu} The menu itself.
             */
            hide: function () {
                this.ele.hide();
                curMenu = null;
                return this;
            },
            /**
             * @description To bind the menu with that element.
             * @param {Elemnet} ele The element to bind with.
             * @returns {Menu} The menu itself.
             */
            bind: function (ele) {
                var self = this;
                ele.on('hold', function (e, x, y) {
                    self.show(x, y);
                });
                ele.listen('mouseup', function (e) {
                    if (e.which < 3) {
                        return;
                    }
                    e.preventDefault();
                    self.show(e.clientX, e.clientY);
                }, { passive: false });
                preventCtx(ele);
                return this;
            }
        }
    );

    var curMenu;

    var layer = Menu.layer = DOM.create('div#menu-layer');
    preventCtx(layer);
    layer.listen('mouseup', function () {
        if (curMenu) {
            curMenu.hide();
        }
        setImmediate(function () {
            layer.hide();
        });
    });
    function resize() {
        layer.css('width', win.innerWidth + 'px');
        layer.css('height', win.innerHeight + 'px');
    }
    win.listen('resize', resize);
    DOM.ready(function () {
        resize();
        win.document.body.appendChild(layer);
    });

    /**
     * @description The constructor of items.
     * @param {string} text [optional] The text to display.
     * @param {ClickCallback} callback [optional] The click callback.
     */
    var Item = Menu.Item = new Constructor(
        function (text, callback) {
            var str = 'button.menu-item';
            this.ele = DOM.create(
                str
            ).listen('mousedown', function (e) {
                if (e.which > 1) {
                    return;
                }
                Loop.each(callbacks, function (cb) {
                    cb(e);
                });
            });
            preventCtx(this.ele);
            var callbacks = this.callbacks = [];
            if (typeof text === 'string') {
                this.setText(text);
            }
            if (callback) {
                this.addCallback(callback);
            }
        }, {
            /**
             * @description To set the text of the item.
             * @param {string} text The text to display.
             * @returns {Item} The item itself.
             */
            setText: function (text) {
                this.ele.innerHTML = text;
                return this;
            },
            /**
             * @description To add a callback to the item.
             * @param {ClickCallback} callback The click callback.
             * @returns {Item} The item itself.
             */
            addCallback: function (callback) {
                this.callbacks.push(callback);
                return this;
            }
        }
    );

    return Menu;

});