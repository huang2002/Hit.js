/**
 * @file Hit.msgBox.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 */
'use strict';
DOM.ready(function() {
    Extension.define('msgBox', [], function() {

        var msgBoxEle = DOM.create('div#msgBox.msgBox').appendTo(document.body),
            msgBoxText = DOM.create('p#msgBox-text.msgBox-text').appendTo(msgBoxEle),
            msgBoxCloseBtn = DOM.create('button#msgBox-close-btn.msgBox-close-btn{X}').css('font-family', '"Consolas"').appendTo(msgBoxEle);

        var id = null,
            isInAni = false,
            isInAni_changer = function(val) {
                return function() { isInAni = val; }
            },
            fadeOut = function(dur) {
                if (msgBoxEle.css('opacity') < 1) {
                    return;
                }
                isInAni = true;
                msgBoxEle.fadeOut({ fn: Ani.easeIn, dur: dur }).listen('stop', isInAni_changer(false));
                isInAni = true;
            };
        msgBoxCloseBtn.listen('click', function() {
            if (!isInAni) {
                fadeOut(200);
            }
            if (id) {
                clearTimeout(id);
            }
        });

        /**
         * @description The main method which displays the message.
         * @param {string} msg The message.
         * @param {number} timeout The time before hiding the box automatically. If the value is not given, the message box will be closed only by clicking the close button.
         * @returns {undefined} No return value.
         */
        var msgBox = function(msg, timeout) {
            msgBoxText.html(msg);
            isInAni = true;
            var ani = msgBoxEle.fadeIn({ fn: Ani.easeOut, dur: 300, fps: 50 }).listen('stop', isInAni_changer(false));
            if (typeof timeout === 'number') {
                ani.listen('stop', function() {
                    if (id) {
                        clearTimeout(id);
                    }
                    id = setTimeout(function() {
                        if (!isInAni) {
                            fadeOut(600);
                        }
                        id = null;
                    }, Math.max(0, timeout));
                });
            }
        };

        return msgBox;
    });
});