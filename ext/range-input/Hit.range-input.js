/**
 * @file Hit.range-input.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 * @overview These scripts will detect the range inputs without attribute "data-range-ignore" and replace them with custom range inputs. The new range input will be: div.range{ div.range-inner{ div.range-thumb } }, and the original input will be hidden and receive the value so that you can just operate the range input.
 */
DOM.load(function () {
    Loop.each(DOM.select('input'), function (input) {
        if (input.type.toLowerCase() !== 'range' || input.attr('data-range-ignore')) {
            return;
        }
        var outer = DOM.create('div.range'),
            inner = DOM.create('div.range-inner').appendTo(outer),
            thumb = DOM.create('div.range-thumb').appendTo(inner);
        var isActive = false;
        var startInput = function (e) {
            e.preventDefault();
            e.stopPropagation();
            input.trigger('focus');
            isActive = true;
        };
        var stopInput = function () {
            isActive = false;
            input.trigger('blur');
        };
        var inputValue = function (e) {
            if (!isActive) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            var min = (input.min - 0) || 0,
                max = input.max !== '' ? (input.max - 0) : 100,
                step = (input.step - 0) || 1,
                range = max - min,
                or = outer.getBoundingClientRect(),
                w = thumb.getBoundingClientRect().width / 1.3,
                width = or.width - w,
                ox = e.x - or.left - w / 2,
                value = Math.med(0, Math.floor((ox / width) * Math.ceil(range / step)), range) / range;
            thumb.css('margin-left', value * width + 'px');
            input.value = min + value * range;
            input.trigger('input');
        };
        outer.listen('pointerdown', startInput);
        window.listen('pointermove', inputValue);
        outer.listen('click', function (e) {
            startInput(e);
            inputValue(e);
            stopInput();
        });
        window.listen('pointerup', stopInput);
        var par = input.parentNode,
            index = Array.from(input.generation()).indexOf(input);
        input.hide();
        outer.insertTo(index, par);
        if (input.value) {
            var min = (input.min - 0) || 0,
                max = input.max !== '' ? (input.max - 0) : 100,
                range = max - min;
            thumb.css('margin-left', (input.value - min) / range * (outer.getBoundingClientRect().width - thumb.getBoundingClientRect().width / 1.3) + 'px');
        }
    });
});