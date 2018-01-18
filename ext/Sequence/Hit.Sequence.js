/**
 * @file Hit.Sequence.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 * @overview This file defined a constructor called 'Sequence', and you can use it to execute codes in sequence easily.
 */
Extension.define('Sequence', [], function () {
    "use strict";

    /**
     * @description The constructor of sequences.
     * @param {number} delay The delay.
     * @param {Function} callback The callback.
     */
    var Sequence = new Constructor(
        function (delay, callback) {
            this._callbacks = [];
            this._delays = [];
            this._offset = 0;
            if (callback && delay !== undefined) {
                this.next(delay, callback);
            }
        }, {
            /**
             * @description To set the next callback and delay.
             * @param {number} delay The delay.
             * @param {Function} callback The callback.
             * @returns {Sequence} Self.
             */
            next: function (delay, callback) {
                this._callbacks.push(callback);
                this._delays.push(delay + this._offset);
                this._offset += delay;
                return this;
            },
            /**
             * @description To execute the sequence.
             * @returns {Array<number>} The IDs returned by setTimeout.
             */
            execute: function () {
                return Loop.map(this._callbacks, function (callback, i) {
                    return setTimeout(callback, this._delays[i]);
                }, this);
            }
        }
    );

    /**
     * @description To create a new sequence.
     * @param {number} delay The delay.
     * @param {Function} callback The callback.
     * @returns {Sequence} The sequence.
     */
    Sequence.create = function (delay, callback) {
        return new Sequence(delay, callback);
    };

    return Sequence;

});