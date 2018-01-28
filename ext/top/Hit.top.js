/**
 * @file Hit.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 * @description This file creates a button which user can click it to go to the top of the page.
 */

'use strict';

DOM.ready(function () {

    var ele = DOM.create('div#top.top'),
        scrollingElement = document.scrollingElement || document.documentElement;

    ele.attr('title', '返回顶部');

    ele.html('<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 50 50"><path d="M 15 30 L 25 17 L 35 30" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>');

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
            ani = ele.fadeOut({ dur: 200 });
            ani.to = 0;
        },
        update = function () {
            if (scrollingElement.scrollTop > 0) {
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
    if (scrollingElement.scrollTop > 0) {
        fadeIn();
    }

    document.body.appendChild(ele);

});