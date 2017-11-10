/**
 * @file Hit.range-input.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 * @overview These scripts will detect the elements has the class "range-value" and bind its innerHTML with the range input element selected by the selector which is defined in the attribute "data-input".
 * @example <span class="range-value" data-input="#range"></span>
 */

DOM.load(function () {
    Loop.each(DOM.select('.range-value'), function (ele) {
        var input = document.getElementById(ele.attr('data-input'));
        if (input) {
            input.listen('input', function () {
                ele.html(input.value);
            });
        }
        ele.html(input.value);
    });
});