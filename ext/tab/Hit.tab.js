/**
 * @file Hit.Tab.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 * @overview This file defined something to help you create tabs that are bound with views easily.
 */

// The DOM structure should be like this:
// ...
// <div class="tab-group" data-view-group="views" data-tab-default="t1">
// <!--
//   class="tab-group" - Tell script this is a tab group.
//   data-view-group="..." - The id of the view group bound with this tab group.
//   data-tab-default=".." - The id of the default tab.
// -->
//     <span id="t1" class="tab active" data-view="v1">Tab1</span>
//     <!--
//       class="tab ..." - Tell script this is a tab.
//       class="... active" - Class "active" means this tab is active.
//       data-view="..." - The id of the view bound with this tab.
//     -->
//     <span id="t2" class="tab" data-view="v2">Tab2</span>
//     ...
// </div>
// ...
// 
// <!-- 
//   Script will search the tab groups and bind them with views.
//   When a tab is clicked, "active" will be added to the class list of the view bound with it,
//   and an "active" event will be emitted on both the tab element and the view element.
// -->
// 
// ...
// <!-- The view group: -->
// <div id="views">
//     <!-- Class "active" means this view is active. -->
//     <span id="v1" class="view active">View1</span>
//     <span id="v2" class="view">View2</span>
//     ...
// </div>
// ...

Extension.define('Tab', [], function () {
    "use strict";

    var doc = document;

    var Tab = {};

    /**
     * @description The cache that contains the tab groups.
     * @type {Set<Element>}
     */
    var cache = Tab.cache = new Set();

    var search = Tab.search = function () {

        var tabGroups = doc.getElementsByClassName('tab-group');
        Loop.each(tabGroups, function (tabGroup) {
            if (cache.has(tabGroup)) {
                return;
            }
            cache.add(tabGroup);

            var attr_views = tabGroup.attr('data-view-group'),
                viewGroup = attr_views ? doc.getElementById(attr_views) : null,
                views = viewGroup ? viewGroup.getElementsByClassName('view') : null;

            var tabs = tabGroup.getElementsByClassName('tab'),
                attr_defTab = tabGroup.attr('data-tab-default'),
                defTabId = attr_defTab || tabs[0].id;
            Loop.each(tabs, function (tab) {

                var attr_view = tab.attr('data-view');
                tab.listen('active', function () {
                    Loop.each(views, function (v) {
                        if (v.id && v.id === attr_view) {
                            v.addClass('active');
                            v.trigger('active');
                        } else {
                            v.delClass('active');
                        }
                    })
                });

                tab.listen('click', function () {
                    Loop.each(tabs, function (t) {
                        if (t === tab) {
                            t.addClass('active');
                            t.trigger('active');
                        } else {
                            t.delClass('active');
                        }
                    })
                });

                if (tab.id && tab.id === defTabId) {
                    tab.addClass('active');
                    tab.trigger('active');
                } else {
                    tab.delClass('active');
                }

            });

        });

    };

    DOM.load(Tab.search);

    return Tab;

});