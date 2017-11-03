/**
 * @file Hit.msgBox.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 */
DOM.ready(function() {
    Extension.define('msgBox', [], function() {
        'use strict';

        var msgBoxEle = DOM.create('div#msgBox.msgBox').appendTo(document.body),
            msgBoxText = DOM.create('p#msgBox-text.msgBox-text').appendTo(msgBoxEle),
            msgBoxCloseBtn = DOM.create('button#msgBox-close-btn.msgBox-close-btn').html('X').appendTo(msgBoxEle);

        var isInAni = false,
            isInAni_changer = function(val) {
                return function() { isInAni = val; }
            },
            fadeOut = function() {
                isInAni = true;
                msgBoxEle.fadeOut({ fn: Ani.easeIn, dur: 300 }).listen('stop', isInAni_changer(false));
                isInAni = true;
            };
        msgBoxCloseBtn.listen('click', function() {
            if (!isInAni) {
                fadeOut();
            }
        });

        /**
         * @description The main method which displays the message.
         * @param {string} msg The message.
         * @param {number} timeout The time before hiding the box automatically.
         * @returns {undefined} No return value.
         */
        return function(msg, timeout) {
            msgBoxText.html(msg);
            isInAni = true;
            var ani = msgBoxEle.fadeIn({ fn: Ani.easeOut, dur: 300 }).listen('stop', isInAni_changer(false));
            if (typeof timeout === 'number') {
                ani.listen('stop', function() {
                    setTimeout(function() {
                        if (!isInAni) {
                            fadeOut();
                        }
                    }, Math.max(0, timeout));
                });
            }
        };
    });
});