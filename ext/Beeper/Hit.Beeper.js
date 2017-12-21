/**
 * @file Hit.Beeper.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 * @overview This file defined some new methods to make sounds.
 */

Extension.define('Beeper', [], function () {
    "use strict";

    var win = window;

    // fix
    if (('webkitAudioContext' in win) && !('AudioContext' in win)) {
        win.AudioContext = win.webkitAudioContext;
    }

    // Return directly if not supported.
    if (!('AudioContext' in win)) {
        return {
            supported: false // Not supported.
        };
    }

    var ctx = new AudioContext();

    // The constructor of beepers.
    var Beeper = new Constructor(
        function Beeper() {
            this.oscillatorNode = ctx.createOscillator();
            this.gainNode = ctx.createGain();
            this._hasStarted = false;
        }, {
            // init beeper.
            init: function () {
                Beeper.concat([this.oscillatorNode, this.gainNode, ctx.destination]);
                return this;
            },
            // start beeping.
            start: function () {
                this._hasStarted = true;
                this.oscillatorNode.start();
                return this;
            },
            // stop beeping.
            stop: function () {
                this.oscillatorNode.stop();
                return this;
            },
            // set gain.
            setGain: function (val) {
                this.gainNode.gain.setValueAtTime(val, ctx.currentTime);
                return this;
            },
            // fade in gain.
            fadeInGain: function (val, dur) {
                this.setGain(0);
                this.gainNode.gain.linearRampToValueAtTime(val, ctx.currentTime + dur / 1000);
                return this;
            },
            // fade out gain.
            fadeOutGain: function (dur) {
                this.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + dur / 1000);
                return this;
            },
            // set frequency.
            setFreq: function (val) {
                this.oscillatorNode.frequency.setValueAtTime(val, ctx.currentTime);
                return this;
            },
            // set type.
            setType: function (val) {
                this.oscillatorNode.type = val;
                return this;
            },
            // fade in
            fadeIn: function (val, dur) {
                if (!this._hasStarted) {
                    try {
                        this.start();
                    } catch (err) {
                        // Do nothing.
                    }
                }
                this.fadeInGain(val, dur);
                return this;
            },
            // fade out
            fadeOut: function (dur) {
                this.fadeOutGain(dur);
                var self = this;
                return this;
            }
        }
    );

    // context
    Beeper.context = ctx;

    // Connect the objects.
    Beeper.concat = function (objArr) {
        objArr.reduce(function (prev, curr) {
            prev.connect(curr);
            return curr;
        });
        return this;
    };

    /**
     * @description Beep with config.
     * @param {any} config.dest The destination to connect. (If config.dest is not given, beeper.init will be called.)
     * @param {string} config.type The type.
     * @param {number} config.freq The frequency.
     * @param {number} config.gain The gain.
     * @param {number} config.dur The duration. (Will not stop if config.dur isn't given.)
     * @param {number} config.fadeIn Gain fade in duration. (In milliseconds.)
     * @param {number} config.fadeOut Gain fade out duration. (In milliseconds.)
     * @returns {Beeper} The beeper.
     */
    Beeper.play = function (config) {
        if (!(config instanceof Object)) {
            throw new Error('No config!');
        }
        var beeper = new Beeper();
        if ('dest' in config) {
            beeper.oscillatorNode.connect(beeper.gainNode).connect(config.dest);
        } else {
            beeper.init();
        }
        if ('type' in config) {
            beeper.setType(config.type);
        }
        if ('freq' in config) {
            beeper.setFreq(config.freq);
        }
        if ('gain' in config) {
            var gain = config.gain;
            if ('fadeIn' in config) {
                beeper.fadeInGain(gain, config.fadeIn);
            } else {
                beeper.setGain(gain);
            }
        }
        if ('dur' in config) {
            var dur = config.dur;
            if ('fadeOut' in config) {
                var fadeOut = config.fadeOut;
                setTimeout(function () {
                    beeper.fadeOutGain(fadeOut);
                }, dur - fadeOut);
            }
            setTimeout(function () {
                beeper.stop();
            }, dur);
        }
        beeper.start();
        return beeper;
    };

    // Simple beep.
    Beeper.beep = function (freq, dur) {
        if (arguments.length > 1) {
            return Beeper.play({
                freq: freq,
                dur: dur
            });
        } else {
            return Beeper.play({
                freq: freq
            });
        }
    };

    /**
     *  @typedef {Array} BeepArr The array which describes the frequencies and durations (in milliseconds). ([freq0, dur0, freq1, dur1, ...]) 
     */

    // The constructor of beep sequences.
    Beeper.BeepSequence = new Constructor(
        function BeepSequence(beepArr, config) {
            config = config || {};
            this.isRunning = false;
            this.beeper = new Beeper();
            this.beeper.init();
            if (config.type) {
                this.beeper.setType(config.type);
            }
            this.fadeIn = config.fadeIn || 0;
            this.fadeOut = config.fadeOut || 0;
            this.gain = 'gain' in config ? config.gain : 1;
            this.beepArr = beepArr || [];
            this.gap = config.gap || 0;
        }, {
            // start the sequence.
            start: function () {
                if (this.isRunning) {
                    return this;
                }
                var beeper = this.beeper;
                beeper.setGain(0);
                var s = 0;
                Loop.each(this.beepArr, function (v, i) {
                    if (i & 1) {
                        s += v;
                    } else {
                        beeper.oscillatorNode.frequency.setValueAtTime(v, ctx.currentTime + s / 1000);
                    }
                });
                if (this.fadeIn > 0) {
                    beeper.fadeInGain(this.gain, this.fadeIn);
                } else {
                    beeper.setGain(this.gain);
                }
                if (this.fadeOut > 0) {
                    var fadeOut = this.fadeOut;
                    setTimeout(function () {
                        beeper.fadeOutGain(fadeOut);
                    }, s - fadeOut);
                }
                beeper.start();
                return this;
            },
            // stop the sequence.
            stop: function () {
                if (this.isRunning) {
                    this.isRunning = false;
                    this.beeper.stop();
                }
                return this;
            }
        }
    );

    /**
     * @description Simple beep array.
     * @param {BeepArr} arr The beep array.
     * @param {number} config.gap The gap between each beep. (Default: 0)
     * @param {number} config.base The base duration of each beep. (Default: 1)
     * @param {string} config.type The type given to oscillator.
     * @param {number} config.gain The gain.
     * @param {number} config.fadeIn The fade in duration.
     * @param {number} config.fadeOut The fade out duration.
     * @returns {BeepSequence} The sequence.
     */
    Beeper.beepArr = function (arr, config) {
        if (!(arr instanceof Array)) {
            throw new Error('Illegal array!');
        }
        config = config || {};
        var base = config.base;
        if (base > 0) {
            arr = Loop.map(arr, function (ele, i) {
                return i & 1 ? ele * base : ele;
            });
        }
        var sequence = new Beeper.BeepSequence(arr, config);
        sequence.start();
        return sequence;
    };

    // scale
    Beeper.SCALE = {
        L1: 131,
        L2: 147,
        L3: 165,
        L4: 175,
        L5: 196,
        L6: 220,
        L7: 247,
        M1: 262,
        M2: 294,
        M3: 330,
        M4: 349,
        M5: 392,
        M6: 440,
        M7: 494,
        H1: 523,
        H2: 587,
        H3: 659,
        H4: 698,
        H5: 784,
        H6: 880,
        H7: 988
    };

    // Supported.
    Beeper.supported = true;

    return Beeper;

});