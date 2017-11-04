/**
 * @file Hit.range-input.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 */

/**
 * @description To replace all the range inputs without attribute "data-range-ignore" with custom range inputs. The new range input will be: div.range{ div.range-inner{ div.range-thumb } }, and the original input will be hidden and receive the value so that you can just operate the range input.
 */
DOM.load(function() {
    Loop.each(DOM.select('input'), function(input) {
        if (input.type.toLowerCase() !== 'range' || input.attr('data-range-ignore')) {
            return;
        }
        var outer = DOM.create('div.range'),
            inner = DOM.create('dib.range-inner').appendTo(outer),
            thumb = DOM.create('div.range-thumb').appendTo(inner);
        var isActive = false;
        var startInput = function() {
            input.trigger('focus');
            isActive = true;
        };
        var stopInput = function() {
            input.trigger('blur');
            isActive = false;
        };
        var inputValue = function(e) {
            if (!isActive) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            if ('touches' in e) {
                e = e.touches[0];
            }
            var min = (input.attr('min') - 0) || 0,
                max = input.attr('max') !== null ? (input.attr('max') - 0) : 100,
                step = (input.attr('step') - 0) || 1,
                range = max - min,
                or = outer.getBoundingClientRect(),
                tr = thumb.getBoundingClientRect(),
                w = tr.width,
                width = or.width - w,
                ox = e.clientX - or.left - w / 2,
                value = Math.med(0, Math.floor((ox / width) * Math.ceil(range / step)), range) / range;
            thumb.css('margin-left', value * width + 'px');
            input.value = min + value * range;
            input.trigger('input');
        };
        thumb.listen('mousedown', startInput);
        thumb.listen('touchstart', startInput);
        window.listen('mousemove', inputValue);
        window.listen('touchmove', inputValue);
        window.listen('mouseup', stopInput);
        window.listen('touchend', stopInput);
        if (input.attr('value')) {
            thumb.css('margin-left', value * (outer.getBoundingClientRect().width - thumb.getBoundingClientRect().width) + 'px');
        }
        var par = input.parentNode,
            index = Array.from(input.generation()).indexOf(input);
        input.hide();
        outer.insertTo(index, par);
    });
});