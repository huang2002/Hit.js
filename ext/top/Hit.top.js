/**
 * @file Hit.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 * @description This file creates a button which user can click it to go to the top of the page.
 */

'use strict';

DOM.ready(function () {

    var ele = DOM.create('div#top.top');

    ele.attr('title', '返回顶部');

    ele.listen('click', function () {
        fadeOut();
        window.scrollTo(0, 0);
    });

    var ani = null,
        fadeIn = function () {
            ani = ele.fadeIn();
            ani.to = 1;
        },
        fadeOut = function () {
            ani = ele.fadeOut();
            ani.to = 0;
        },
        update = function () {
            if (document.documentElement.scrollTop > 0) {
                if (ani) {
                    if (ani.to !== 1) {
                        ani.stop();
                        fadeIn();
                    }
                } else {
                    fadeIn();
                }
            } else {
                if (ani) {
                    if (ani.to !== 0) {
                        ani.stop();
                        fadeOut();
                    }
                } else {
                    fadeOut();
                }
            }
        };
    window.listen('scroll', update);
    update();

    document.body.appendChild(ele);

});