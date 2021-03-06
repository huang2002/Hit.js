# Hit.js

> A javascript lib.

## What's Hit.js?

It is a javascript lib which not only defines some useful methods and constructors but also contains some simple polyfills and shims. In addition, it has detailed comments so that you can just read the file and find out what it can do.

### Some constructors in Hit.js:

- Constructor
- ObjectPool
- Agency
- Ani.Frame

### Some objects in Hit.js:

- Loop
    - each
    - map
    - filter
    - find
    - findIndex
    - some
    - every
    - repeat
- Compare
    - isNaN
    - equal
- DOM
    - select
    - create
    - trigger
    - ready
    - CustomEvents
- Ani
    - Frame
    - createFrame
    - Transition
    - createTransition
    - getFn
    - cubicAccuracy
    - cubic
    - linear
    - ease
    - easeIn
    - easeOut
    - easeInOut
    - steps
- Ajax
    - Result
    - Config
    - send
    - parseURL
    - joinParams
- Script
    - includePath
    - loadOne
    - loadSome
    - loadGroup
- Extension
    - export
    - import
    - need
    - define

### Some newly-defined methods:

- Object.
    - concat
- Object.prototype.
    - _set
- Element.prototype.
    - attr
    - css
    - html
    - toAbbr
    - appendTo
    - insertTo
    - addClass
    - delClass
    - disable
    - hide
    - show
    - val
    - remove
    - generation
    - prev
    - next
    - scroll
    - ani
    - fadeOut
    - fadeIn
- Function.prototype.
    - after
    - before
    - single
    - limit
- Array.prototype.
    - randEle
    - replaceWith
    - delIndex
    - split
    - at
- Array
    - range
- Math.
    - mid
    - med
    - mix
    - cut
    - distance
    - distance_p
    - distance3d
    - distance3d_p
    - rand
    - randInt

## Extensions

In the folder `ext`, you will find various extensions, and They export (using `Extension.*`) different things. You can read the comments in each file to learn what they exported, and use `Extension.*` to employ them.

### Some extensions:

- ext\Beeper\Hit.Beeper.js
    - Beeper
- ext\Canvas\Hit.Canvas.js
- ext\Game\Hit.Game.js
    - Game-UI
    - Game-Controller
    - Game-Scene
    - Game
- ext\LocalStore\Hit.LocalStore.js
    - LocalStore
- ext\Menu\Hit.Menu.js
    - Menu
- ext\msgBox\Hit.msgBox.js
    - msgBox
- ext\range-input\Hit.range-input.js
- ext\range-value\Hit.range-value.js
- ext\Sequence\Hit.Sequence.js
    - Sequence
- ext\World\Hit.World.js
    - World
- ext\tab\Hit.tab.js
- ext\top\Hit.top.js

## :)
