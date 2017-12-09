# Hit.js

> A useful javascript lib.

## What's Hit.js?

It is a javascript lib which not only defines some useful methods and constructors but also contains some polyfills and shims. In addition, it has detailed comments so that you can just read the file and find out what it can do.

### Some constructors in Hit.js:

- Constructor
- Sequence
- ObjectPool
- Chain
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
- Compare
    - isNaN
    - equal
- DOM
    - select
    - create
    - trigger
    - ready
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

- Object
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
- Array.prototype.
    - randEle
    - replaceWith
- Math.
    - mid
    - med
    - mix
    - cut
    - distance
    - distance_p
    - distance3d
    - distance3d_p

## Extensions

In the folder `ext`, you will find various extensions, and They export(using `Extension.*`) different things. You can read the comments in each file to learn what they exported and use `Extension.*` to employ them.

### Some extensions:

- ext\Game\Hit.Game.js
    - Game-UI
    - Game-Controller
    - Game-Scene
    - Vector
    - Position
- ext\LocalStore\Hit.LocalStore.js
    - LocalStore
- ext\msgBox\Hit.msgBox.js
    - msgBox
- ext\range-input\Hit.range-input.js
- ext\range-value\Hit.range-value.js
- ext\Canvas\Hit.Canvas.js
- ext\top\Hit.top.js

## Try it :D

Welcome to point out my mistakes. That will help me do better.
