/**
 * @file Hit.range-input.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 */

DOM.load(function() {
    Loop.each(DOM.select('.range-value'), function(ele) {
        var input = document.getElementById(ele.attr('data-input'));
        if (input) {
            input.listen('input', function() {
                ele.html(input.value);
            });
        }
        ele.html(input.value);
    });
});