/**
 * @file Hit.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 */

'use strict';

/**
 * @description To create a constructor.
 * @param {Function} fn The function constructs the object.
 * @param {{[key: string]: string}} prototype The prototype.
 * @param {Array<Constructor>} inherit The inheritances.
 * @returns {Function} The constructor.
 */
var Constructor = function (fn, prototype, inherit) {
    if (prototype) {
        if (inherit) {
            fn.prototype = Object.concat([Object.concat(Loop.map(inherit, function (inh) { return inh.prototype; })), fn.prototype, prototype]);
        } else {
            fn.prototype = Object.concat([fn.prototype, prototype]);
        }
    } else if (inherit) {
        fn.prototype = Object.concat([Object.concat(Loop.map(inherit, function (inh) { return inh.prototype; })), fn.prototype]);
    }
    if (inherit) {
        fn = (function (f) {
            var fun = function () {
                var args = arguments;
                Loop.each(inherit, function (inh) {
                    inh.apply(this, args);
                }, this);
                f.apply(this, args);
            };
            fun.prototype = f.prototype;
            return fun;
        })(fn);
    }
    return fn;
};

/** @description This object has some methods to traversal objects and arrays. */
var Loop = {
    /**
     * @description A method like Array.prototype.forEach
     * @param {Array|Object} arr The object to traversal.
     * @param {(value, index, arr) => void} callback The function to receive the elements.
     * @param {any} thisArg The "this" argument of "callback".
     */
    each: function (arr, callback, thisArg) {
        if (!(arr instanceof Object)) {
            return;
        }
        if (typeof arr.length === 'number') {
            for (var i = 0; i < arr.length; i++) {
                callback.call(thisArg, arr[i], i, arr);
            }
        } else {
            for (var k in arr) {
                callback.call(thisArg, arr[k], k, arr);
            }
        }
    },
    /**
     * @description A method like Array.prototype.map
     * @argument {Array|Object} arr The object to traversal.
     * @argument {(value, index, arr) => any} callback The function to receive the elements and return something as part of the result.
     * @param {any} thisArg The "this" argument of "callback".
     * @returns {Array<any>} The result contains the values returned by callback.
     */
    map: function (arr, callback, thisArg) {
        if (!(arr instanceof Object)) {
            return;
        }
        var isArray = typeof arr.length === 'number',
            ans = isArray ? [] : {};
        Loop.each(arr, function (v, i, a) {
            var val = callback.call(this, v, i, a);
            if (isArray) {
                ans.push(val);
            } else {
                ans[i] = val;
            }
        }, thisArg);
        return ans;
    },
    /**
     * @description A method like Array.prototype.filter
     * @argument {Array|Object} arr The object to traversal.
     * @argument {(value, index, arr) => boolean} callback The function to tell whether the element should be preserved.
     * @param {any} thisArg The "this" argument of "callback".
     * @returns {Array<any>} The result contains all the values filtered by callback.
     */
    filter: function (arr, callback, thisArg) {
        if (!(arr instanceof Object)) {
            return;
        }
        var isArray = typeof arr.length === 'number',
            ans = isArray ? [] : {};
        Loop.each(arr, function (v, i, a) {
            var val = callback.call(this, v, i, a);
            if (!val) {
                return;
            }
            if (isArray) {
                ans.push(v);
            } else {
                ans[i] = v;
            }
        }, thisArg);
        return ans;
    },
    /**
     * @description A method like Array.prototype.find
     * @argument {Array|Object} arr The object to traversal.
     * @argument {(value, index, arr) => boolean} callback The function to tell whether the element matches the condition.
     * @param {any} thisArg The "this" argument of "callback".
     * @returns {any} The element matches the condition.
     */
    find: function (arr, callback, thisArg) {
        try {
            Loop.each(arr, function (v, k, a) {
                if (callback.call(this, v, k, a)) {
                    throw v;
                }
            }, thisArg);
        } catch (ans) {
            return ans;
        }
        return undefined;
    },
    /**
     * @description A method like Array.prototype.findIndex
     * @argument {Array|Object} arr The object to traversal.
     * @argument {(value, index, arr) => boolean} callback The function to tell whether the element matches the condition.
     * @param {any} thisArg The "this" argument of "callback".
     * @returns {number|string} The index/key of the element which matches the condition.
     */
    findIndex: function (arr, callback, thisArg) {
        try {
            Loop.each(arr, function (v, k, a) {
                if (callback.call(this, v, k, a)) {
                    throw k;
                }
            }, thisArg);
        } catch (ans) {
            return ans;
        }
        return -1;
    },
    /**
     * @description A method like Array.prototype.some
     * @argument {Array|Object} arr The object to traversal.
     * @argument {(value, index, arr) => boolean} callback The function to tell whether the element matches the condition.
     * @param {any} thisArg The "this" argument of "callback".
     * @returns {boolean} Whether there is any element matches the condition.
     */
    some: function (arr, callback, thisArg) {
        try {
            Loop.each(arr, function (v, i, a) {
                if (callback.call(this, v, i, a)) {
                    throw true;
                }
            }, thisArg);
        } catch (flag) {
            return flag;
        }
        return false;
    },
    /**
     * @description A method like Array.prototype.every
     * @argument {Array|Object} arr The object to traversal.
     * @argument {(value, index, arr) => boolean} callback The function to tell whether the element matches the condition.
     * @param {any} thisArg The "this" argument of "callback".
     * @returns {boolean} Whether there all the elements match the condition.
     */
    every: function (arr, callback, thisArg) {
        try {
            Loop.each(arr, function (v, i, a) {
                if (!callback.call(this, v, i, a)) {
                    throw false;
                }
            }, thisArg);
        } catch (flag) {
            return flag;
        }
        return true;
    }
};

/** @description This object has some methods about comparison. */
var Compare = {
    /**
     * @description To tell whether the arg is NaN.
     * @param {any} arg The arg.
     * @returns {boolean} The result.
     */
    isNaN: function (arg) {
        return typeof arg === 'number' && isNaN(arg);
    },
    /**
     * @description Tell whether a equals b. (NaN will equal NaN)
     * @param {any} a One variable to compare.
     * @param {any} b Another variable to compare.
     * @returns {boolean} Whether a equals b.
     */
    equal: function (a, b) {
        return (a === b) || (Compare.isNaN(a) && Compare.isNaN(b));
    }
};

//#region - extend objects

// Object
Loop.each({
    /**
     * @description To mix the objects into one object.
     * @param {Array<Object>} objArr The array of objects to mix.
     * @returns {Object} The result object.
     */
    concat: function (objArr) {
        var ans = {};
        Loop.each(objArr, function (obj) {
            ans._set(obj);
        });
        return ans;
    }
}, function (v, k) {
    Object[k] = v;
});

// objects
Loop.each({
    /**
     * @description To set properties of the object.
     * @param {Object} obj The object describes the properties.
     * @returns {Object} Self.
     */
    _set: function (obj) {
        Loop.each(obj, function (v, k) {
            this[k] = v;
        }, this);
        return this;
    }
}, function (v, k) {
    Object.prototype[k] = v;
});

//#endregion

// extend arrays
Loop.each({
    /**
     * @description To get an element of the array randomly.
     * @returns {any} The random element.
     */
    randEle: function () {
        var len = this.length;
        return len > 0 ? this[Math.floor(Math.random() * len)] : undefined;
    },
    /**
     * @description To replace the array with a new array and return the old one.
     * @param {Array<any>} arr The new array.
     * @returns {Array<any>} The old array.
     */
    replaceWith: function (arr) {
        var copy = Array.from(this);
        this.length = 0;
        for (var i = 0; i < arr.length; i++) {
            this.push(arr[i]);
        }
        return copy;
    }
}, function (v, k) {
    Array.prototype[k] = v;
});

// extend functions
Loop.each({
    /**
     * @description To decorate a function. (append a function after)
     * @param {Function} fn The function to append.
     * @returns {Function} A new function.
     */
    after: function (fn) {
        var f = this;
        return function () {
            var ans = f.apply(this, arguments);
            fn.apply(this, arguments);
            return ans;
        };
    },
    /**
     * @description To decorate a function. (append a function before)
     * @param {Function} fn The function to append.
     * @returns {Function} A new function.
     */
    before: function (fn) {
        var f = this;
        return function () {
            fn.apply(this, arguments);
            return f.apply(this, arguments);
        };
    },
    /**
     * @description To create a single instance constructor from the function.
     * @returns {Function} The constructor.
     */
    single: function () {
        var instance = undefined,
            constructor = this;
        return function () {
            if (instance === undefined) {
                instance = {};
                Loop.each(constructor.prototype, function (value, name) {
                    instance[name] = value;
                });
                constructor.apply(instance, arguments);
            }
            return instance;
        };
    }
}, function (ext, key) {
    Function.prototype[key] = ext;
});

/**
 * @description The constructor of object pools.
 * @param {Function} constructor The constructor of the objects in the pool.
 */
var ObjectPool = new Constructor(
    function (constructor) {
        this.constructor = constructor || Object;
        this._pool = [];
    }, {
        /**
         * @description To get an object from the pool. If there's not any object, will create a new object from the constructor.
         * @returns {this.constructor} An object.
         */
        get: function () {
            return this._pool.length ? this._pool.shift() : new this.constructor();
        },
        /**
         * @description To recycle an object so that it can be used again.
         * @param {this.constructor} obj The object to recycle.
         * @returns {number} How many objects are now in the pool.
         */
        recycle: function (obj) {
            if (!(obj instanceof this.constructor)) {
                console.warn('Please input an instance of the constructor!');
            }
            this._pool.push(obj);
            return this._pool.length;
        },
        /**
         * @description To count how many objects are in the pool.
         * @returns {number} The result.
         */
        count: function () {
            return this._pool.length;
        },
        /**
         * @description To prepare enough objects to use.
         * @param {number} count How many objects you need.
         * @returns {ObjectPool} Self.
         */
        prepare: function (count) {
            if (typeof count !== 'number') {
                console.warn('"count" must be a number!');
                return;
            }
            while (this._pool.length < count) {
                this._pool.push(new this.constructor());
            }
            return this;
        },
        /**
         * @description To drop all the objects in the pool.
         * @returns {Array<this.constructor>} The result.
         */
        drop: function () {
            var p = Loop.map(this._pool, function (o) { return o; });
            this._pool = [];
            return p;
        }
    }
);

/**
 * @description The constructor of sequences.
 * @param {number} delay The delay.
 * @param {Function} callback The callback.
 */
var Sequence = new Constructor(
    function (delay, callback) {
        this._callbacks = [];
        this._delays = [];
        this._offset = 0;
        if (callback && delay !== undefined) {
            this.next(delay, callback);
        }
    }, {
        /**
         * @description To set the next callback and delay.
         * @param {number} delay The delay.
         * @param {Function} callback The callback.
         * @returns {Sequence} Self.
         */
        next: function (delay, callback) {
            this._callbacks.push(callback);
            this._delays.push(delay + this._offset);
            this._offset += delay;
            return this;
        },
        /**
         * @description To execute the sequence.
         * @returns {Array<number>} The IDs returned by setTimeout.
         */
        execute: function () {
            return Loop.map(this._callbacks, function (callback, i) {
                return setTimeout(callback, this._delays[i]);
            }, this);
        }
    }
);
/**
 * @description To create a new sequence.
 * @param {number} delay The delay.
 * @param {Function} callback The callback.
 * @returns {Sequence} The sequence.
 */
Sequence.create = function (delay, callback) {
    return new Sequence(delay, callback);
};

//#region - fix

// fix Array
if (!('from' in Array)) {
    Array.from = function (arrayLike) {
        return Loop.map(arrayLike, function (e) { return e; });
    };
}
if (!('of' in Array)) {
    Array.of = function () {
        return Array.from(arguments);
    };
}
if (!('includes' in Array.prototype)) {
    Array.prototype.includes = function (ele, start) {
        return Loop.some(this.slice(start || 0), function (e) { return Compare.equal(e, ele); });
    };
}

// fix strings
if (!('includes' in String.prototype)) {
    String.prototype.includes = function (search, start) {
        return this.slice(start || 0).indexOf(search) !== -1;
    };
}

// fix Map
if (!('Map' in window)) {
    window.Map = function (initialVal) {
        var keys = [],
            values = [];
        Object.defineProperty(this, 'size', {
            get: function () {
                return keys.length;
            }
        });
        this.clear = function () {
            keys = [];
            values = [];
        };
        this.delete = function (key) {
            return Loop.find(keys, function (k, i) {
                if (Compare.equal(key, k)) {
                    keys.splice(i, 1);
                    values.splice(i, 1);
                    return true;
                }
            });
        };
        this.forEach = function (callback, thisArg) {
            Loop.each(keys, function (k, i) {
                callback.call(thisArg, values[i], k, this);
            }, this);
        };
        this.get = function (key) {
            try {
                return this.forEach(function (v, k) {
                    if (Compare.equal(key, k)) {
                        throw v;
                    }
                });
            } catch (v) {
                return v;
            }
        };
        this.has = function (key) {
            return keys.includes(key);
        };
        this.set = function (key, value) {
            this.delete(key);
            keys.push(key);
            values.push(value);
            return this;
        };
        if (initialVal) {
            Loop.each(initialVal, function (pair) {
                this.set(pair[0], pair[1]);
            });
        }
    };
}

// fix Set
if (!('Set' in window)) {
    window.Set = function (initialVal) {
        var values = [];
        Object.defineProperty(this, 'size', {
            get: function () {
                return values.length;
            }
        });
        this.clear = function () {
            values = [];
        };
        this.delete = function (value) {
            return Loop.find(values, function (v, i) {
                if (Compare.equal(value, v)) {
                    values.splice(i, 1);
                    return true;
                }
            });
        };
        this.forEach = function (callback, thisArg) {
            Loop.each(values, function (v, i) {
                callback.call(thisArg, v, v, this);
            }, this);
        };
        this.has = function (value) {
            return values.includes(value);
        };
        this.set = function (value) {
            this.delete(value);
            values.push(value);
            return this;
        };
        if (initialVal) {
            Loop.each(initialVal, this.set);
        }
    };
}

// fix Promise
if (!('Promise' in window)) {
    window.Promise = function (executor) {
        var onfulfilledCallbacks = [],
            onrejectedCallbacks = [],
            onerrorCallbacks = [],
            value = null,
            status = 'pending';
        this.then = function (onfulfilled, onrejected) {
            if (onrejected) {
                if (status === 'rejected') {
                    setTimeout(onrejected, 0, value);
                } else {
                    onrejectedCallbacks.push(onrejected);
                }
            }
            if (onfulfilled) {
                if (status === 'resolved') {
                    try {
                        return new Promise.resolve(onfulfilled(value));
                    } catch (err) {
                        return new Promise.reject(err);
                    }
                } else {
                    return new Promise(function (resolve, reject) {
                        onfulfilledCallbacks.push(function (data) {
                            if (onfulfilled instanceof Function) {
                                try {
                                    var val = onfulfilled(data);
                                    if (val && val.then) {
                                        val.then(resolve, reject);
                                    } else {
                                        resolve(val);
                                    }
                                } catch (err) {
                                    reject(err);
                                }
                            } else {
                                return resolve(onfulfilled);
                            }
                        });
                    });
                }
            } else {
                return this;
            }
        };
        this.catch = function (onerror) {
            onerrorCallbacks.push(onerror);
            return this;
        };
        if (executor) {
            setTimeout(function () {
                executor(function (data) {
                    status = 'resolved';
                    value = data;
                    for (var i = 0; i < onfulfilledCallbacks.length; i++) {
                        onfulfilledCallbacks[i](value);
                    }
                }, function (reason) {
                    status = 'rejected';
                    value = reason;
                    var callbacks = onrejectedCallbacks.length > 0 ? onrejectedCallbacks : onerrorCallbacks;
                    for (var i = 0; i < callbacks.length; i++) {
                        callbacks[i](value);
                    }
                });
            }, 0);
        }
    };
}
if (!('done' in Promise.prototype)) {
    Promise.prototype.done = function (onfulfilled, onrejected) {
        this.then(onfulfilled, onrejected)
            .catch(function (err) {
                throw err;
            });
    };
}
if (!('reject' in Promise)) {
    Promise.reject = function (reason) {
        return new Promise(function (resolve, reject) {
            reject(reason);
        });
    };
}
if (!('resolve' in Promise)) {
    Promise.resolve = function (data) {
        return new Promise(function (resolve, reject) {
            resolve(data);
        });
    };

}
if (!('all' in Promise)) {
    Promise.all = function (promises) {
        return new Promise(function (resolve, reject) {
            var rest = promises.length,
                dataArr = new Array(rest),
                hasPromise = false;
            Loop.each(promises, function (p, i) {
                if (p instanceof Object && 'then' in p) {
                    hasPromise = true;
                    p.then(function (data) {
                        rest--;
                        dataArr[i] = data;
                        if (rest <= 0) {
                            resolve(dataArr);
                        }
                    }, reject);
                }
            });
            if (!hasPromise) {
                resolve(dataArr);
            }
        });
    };
}
if (!('race' in Promise)) {
    Promise.race = function (promises) {
        return new Promise(function (resolve, reject) {
            var hasPromise = false;
            Loop.each(promises, function (p, i) {
                if (p instanceof Object && 'then' in p) {
                    hasPromise = true;
                    p.then(resolve, reject);
                }
            });
            if (!hasPromise) {
                resolve();
            }
        });
    };
}

// fix setImmediate
if (!('setImmediate' in window)) {
    window.setImmediate = function (handler) {
        var args = Array.from(arguments);
        args.splice(1, 0, 0);
        return setTimeout.apply(window, args);
    };
    window.clearImmediate = window.clearTimeout;
}

// fix requestAnimationFrame
if (!('requestAnimationFrame' in window)) {
    window.requestAnimationFrame = function (handler) {
        return setTimeout(handler, 16);
    };
    window.cancelAnimationFrame = window.clearTimeout;
}

// fix Event
if (!('preventDefault' in Event.prototype)) {
    Event.prototype.preventDefault = function () {
        this.returnValue = false;
    };
}
if (!('stopPropagation' in Event.prototype)) {
    Event.prototype.stopPropagation = function () {
        this.bubbles = false;
    };
}

// fix Math
if (!('SQRT2' in Math)) {
    Math.SQRT2 = Math.sqrt(2);
}
if (!('SQRT1_2' in Math)) {
    Math.SQRT1_2 = Math.sqrt(.5);
}

//#endregion

//#region - define ChainNode&Chain

/**
 * @description The constructor of the nodes of chains.
 * @param {any} value The value of the node.
 * @property {ChainNode} prev Previous node.
 * @property {ChainNode} next Next node.
 * @property {any} value The value of the node.
 */
var ChainNode = new Constructor(
    function (value) {
        this.next = null;
        this.prev = null;
        this.value = value;
    }, {
        /**
         * @description To insert a node after the node.
         * @param {ChainNode} node The node to insert.
         * @returns {ChainNode} Next node if it isn't null, self otherwise.
         */
        insertAfter: function (node) {
            if (node == null) {
                if (this.next) {
                    this.next.prev = null;
                    this.next = null;
                }
                return this;
            }
            if (!ChainNode.check(node)) {
                console.warn('Illegal node');
                return undefined;
            }
            this.next = node;
            if (node.prev) {
                node.prev.next = null;
            }
            node.prev = this;
            return node;
        },
        /**
         * @description To insert a node before the node.
         * @param {ChainNode} node The node to insert.
         * @returns {ChainNode} Pervious node if it isn't null, self otherwise.
         */
        insertBefore: function (node) {
            if (node == null) {
                if (this.prev) {
                    this.prev.next = null;
                    this.prev = null;
                }
                return this;
            }
            if (!ChainNode.check(node)) {
                console.warn('Illegal node');
                return undefined;
            }
            this.prev = node;
            if (node.next) {
                node.next.prev = null;
            }
            node.next = this;
            return node;
        },
        /**
         * @description To remove the node.
         * @returns {undefined} No return value.
         */
        remove: function () {
            if (this.prev) {
                this.prev.next = null;
                this.prev = null;
            }
            if (this.next) {
                this.next.prev = null;
                this.next = null;
            }
        }
    }
);
/**
 * @description To check if the object is a node or a node like.
 * @returns {boolean} The result.
 */
ChainNode.check = function (obj) {
    return node instanceof Object && 'next' in node && 'prev' in node;
};
/**
 * @description The constructor of chains.
 * @property {ChainNode} head The first node.
 * @property {ChainNode} tail The last node.
 * @property {ChainNode} pointer The pointer.
 */
var Chain = new Constructor(
    function (initialVal) {
        this.head = null;
        this.tail = null;
        this.pointer = null;
        if (initialVal) {
            Loop.each(initialVal, function (val) {
                this.append(new ChainNode(val));
            }, this);
        }
    }, {
        /**
         * @description To count the nodes of the chain.
         * @returns {number} The length of the chain.
         */
        count: function () {
            if (!this.head) {
                return 0;
            }
            var ans = 1,
                maxLen = Chain.maxLen,
                node = this.head;
            while (node !== this.tail) {
                ans++;
                node = node.next;
                if (ans > maxLen) {
                    console.warn('This chain may be too long to count.');
                    return maxLen;
                }
            }
            return ans;
        },
        /**
         * @description To append a node.
         * @param {ChainNode} node The node to append.
         * @returns {Chain} Self.
         */
        append: function (node) {
            if (!ChainNode.check(node)) {
                console.warn('Illegal node');
                return undefined;
            }
            if (this.tail) {
                node.prev = this.tail;
                this.tail.next = node;
                this.tail = node;
            } else {
                this.pointer = this.tail = this.head = node;
            }
            return this;
        },
        /**
         * @description To convert the chain to array.
         * @param {boolean} copy Whether to copy the nodes. (default value is true)
         * @returns {Array<ChainNode>} The result.
         */
        toArray: function (copy) {
            if (!this.head) {
                return [];
            }
            var maxLen = Chain.maxLen,
                node = this.head,
                ans = [node];
            while (node !== this.tail) {
                node = node.next;
                ans.push(copy !== false ? new ChainNode(node) : node);
                if (ans.length > maxLen) {
                    console.warn('This chain may be too long to convert.');
                    return ans;
                }
            }
            return ans;
        },
        /**
         * @description To move the pointer to the first node.
         * @returns {ChainNode} The first node.
         */
        reset: function () {
            return this.pointer = this.head;
        },
        /**
         * @description To move the pointer to next node.
         * @returns {ChainNode} Next node.
         */
        next: function () {
            if (this.pointer) {
                this.pointer = this.pointer.next;
            }
            return this.pointer;
        },
        /**
         * @description To abandon the last node.
         * @returns {Chain} Self.
         */
        abandon: function () {
            if (this.tail) {
                this.tail.prev.next = null;
                this.tail.prev = null;
                this.tail = this.tail.prev;
            }
            return this;
        }
    }
);
/**
 * @description The max length of a chain.
 * @type {number}
 */
Chain.maxLen = 99999;

//#endregion

/**
 * @description The constructor of agencies.
 * @property {boolean} cache Whether to store the trigger action without being executed at once.
 */
var Agency = new Constructor(
    function () {
        this._listeners = {};
        this._caches = {};
        this.cache = false;
    }, {
        /**
         * @description To trigger the listeners listening at the type.
         * @param {string} type The type.
         * @param {ArrayLike} args The arguments given to the listeners.
         * @returns {boolean} Whether the trigger action is successful.
         */
        trigger: function (type, args) {
            args = args || [];
            if (!(args instanceof Object && 'length' in args)) {
                args = [args];
            }
            if (!(type in this._listeners)) {
                if (this.cache) {
                    if (!(type in this._caches)) {
                        this._caches[type] = [];
                    }
                    this._caches[type].push(args);
                }
                return false;
            }
            this._listeners[type].forEach(function (fn) {
                fn.apply(null, args);
            });
            return true;
        },
        /**
         * @description To create a trigger.
         * @param {string} type The type that the trigger listens at.
         * @returns {Function} The trigger.
         */
        newTrigger: function (type) {
            return function (args) {
                self.trigger(type, args);
            }.bind(this);
        },
        /**
         * @description To add a listener of the type.
         * @param {string} type The type to listen.
         * @param {Function} fn The listener.
         * @returns {Agency} Self.
         */
        listen: function (type, fn) {
            if (this.cache && (type in this._caches)) {
                this._caches[type].forEach(function (args) {
                    fn.apply(null, args);
                });
                delete this._caches[type];
            } else {
                if (this._listeners[type] === undefined) {
                    this._listeners[type] = [];
                }
                this._listeners[type].push(fn);
            }
            return this;
        },
        /**
         * @description To add a listener of the type which  will be used only once.
         * @param {string} type The type to listen.
         * @param {Function} fn The listener.
         * @returns {Agency} Self.
         */
        listenOnce: function (type, fn) {
            var _this = this,
                listener = function () {
                    fn.apply(this, arguments);
                    _this.ignore(type, listener);
                };
            return this.listen(type, listener);
        },
        /**
         * @description To remove a listener of the type.
         * @param {string} type The type of the listener to remove.
         * @param {Function} fn The listener.
         * @returns {Agency} Self.
         */
        ignore: function (type, fn) {
            var l = this._listeners[type];
            if (l !== undefined) {
                for (var i = 0; i < l.length; i++) {
                    if (l[i] === fn) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * @description To remove listeners of the type.
         * @param {string} type The type of the listener to remove.
         * @returns {boolean} Whether the ignoring is successful.
         */
        ignoreType: function (type) {
            return this._listeners[type] === undefined ? false : this._listeners[type] = undefined && true;
        },
        /**
         * @description To remove all the listeners of the agency.
         * @returns {boolean} Whether the ignoring is successful.
         */
        ignoreAll: function () {
            var ans = !!this._listeners || !!this._caches;
            this._listeners = {};
            this._caches = {};
            return ans;
        },
        /**
         * @description To bind some methods(listen, ignore, ignoreAll, ignoreType) of the agency on the object.
         * @param {Object} object The object.
         * @returns {boolean} Whether it binds successfully.
         */
        bind: function (object) {
            try {
                var agency = this;
                Loop.each(['listen', 'listenOnce', 'ignore', 'ignoreAll', 'ignoreType'], function (m) {
                    object[m] = function () {
                        agency[m].apply(agency, arguments);
                        return this;
                    };
                });
                return true;
            } catch (err) {
                return false;
            }
        }
    }
);
/**
 * @description To add a new agency to the object. ($obj._agency)
 * @param {Object} obj The object.
 * @returns {Object} The object.
 */
Agency.bind = function (obj) {
    obj._agency = new Agency();
    obj._agency.bind(obj);
    return obj;
};

// extend Math
Loop.each({
    /**
     * @description To get the element in the middle of an array.
     * @param {ArrayLike<number>} arr An array.
     * @param {boolean} sort Whether to sort the array.
     * @returns {number} The element in the middle of the array.
     */
    mid: function (arr, sort) {
        arr = Array.from(arr);
        if (sort !== false) {
            arr = arr.sort(function (a, b) {
                return a - b;
            });
        }
        var len = arr.length;
        if (len & 1) {
            len -= 1;
        }
        return arr[len / 2];
    },
    /**
     * @description To get the medium one.
     * @argument {number} a One of the three numbers to compare.
     * @argument {number} b One of the three numbers to compare.
     * @param {number} c One of the three numbers to compare.
     * @returns {number} The medium one.
     */
    med: function (a, b, c) {
        return Math.mid([a, b, c]);
    },
    /**
     * @description To get the result of a*k+b*(1-k). (k >= 0 && k <= 1)
     * @argument {number} a One number to mix.
     * @argument {number} b Another number to mix.
     * @param {number} k The ratio of mixing.
     * @returns {number} The result of mixing.
     */
    mix: function (a, b, k) {
        if (k > 1 || k < 0) {
            return NaN;
        }
        return a * k + b * (1 - k);
    },
    /**
     * @description To cut the decimal part.
     * @param {number} num The number.
     * @param {number} len The target length of the decimal part. (Default value is 0.)
     * @returns {number} The result.
     */
    cut: function (num, len) {
        if (typeof num !== 'number') {
            return NaN;
        }
        if (!(len >= 0)) {
            len = 0;
        }
        num = num + '';
        var index = num.indexOf('.');
        if (index !== -1) {
            num = num.split('');
            num.splice(index + len + 1);
            num = num.join('');
        }
        return num - 0;
    },
    /**
     * @description To calculate the distance between (x0, y0) and (x1, y1).
     * @param {number} x0 The x of the first point.
     * @param {number} y0 The y of the first point.
     * @param {number} x1 The x of the second point.
     * @param {number} y1 The y of the second point.
     * @returns {number} The distance.
     */
    distance: function (x0, y0, x1, y1) {
        return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
    },
    /**
     * @description To calculate the distance between p0 and p1.
     * @param {{x: number, y: number}} p0 The first point.
     * @param {{x: number, y: number}} p1 The second point.
     * @returns {number} The distance.
     */
    distance_p: function (p0, p1) {
        return Math.distance(p0.x, p0.y, p1.x, p1.y);
    },
    /**
     * @description To calculate the distance between (x0, y0, z0) and (x2, y2, z2).
     * @param {number} x0 The x of the first point.
     * @param {number} y0 The y of the first point.
     * @param {number} z0 The z of the first point.
     * @param {number} x1 The x of the second point.
     * @param {number} y1 The y of the second point.
     * @param {number} z1 The z of the second point.
     * @returns {number} The distance.
     */
    distance3d: function (x0, y0, z0, x1, y1, z1) {
        return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2) + Math.pow(z0 - z1, 2));
    },
    /**
     * @description To calculate the distance between p0 and p1.
     * @param {{x: number, y: number, z:number}} p0 The first point.
     * @param {{x: number, y: number, z:number}} p1 The second point.
     * @returns {number} The distance.
     */
    distance3d_p: function (p0, p1) {
        return Math.distance3d(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
    }
}, function (ext, key) {
    Math[key] = ext;
});

// extend Array
Object.defineProperties(Array.prototype, {
    /**
     * @description Point to the first element of the array.
     */
    first: { get: function () { return this.length > 0 ? this[0] : undefined; } },
    /**
     * @description Point to the last element of the array.
     */
    last: { get: function () { return this.length > 0 ? this[this.length - 1] : undefined; } }
});
Loop.each({
    /**
     * @description To split an array.
     * @param {number}
     */
    split: function (len, cut) {
        if (typeof len !== 'number' || len <= 0 || len % 1 !== 0 || len >= this.length) {
            return [Array.from(this)];
        }
        var ans = [],
            l = Math[cut !== false ? 'floor' : 'ceil'](this.length / len) * len;
        for (var i = 0; i < l; i += len) {
            ans.push([]);
            for (var j = 0; j < len; j++) {
                if (i + j >= this.length) {
                    break;
                }
                ans.last.push(this[i + j]);
            }
        }
        return ans;
    }
}, function (v, k) {
    Array.prototype[k] = v;
});

/** @description This object has some methods or constructors about DOM. */
var DOM = {
    /**
     * @description To create an element by abbr.
     * @param {string} str The abbr of the element.
     * @returns {Element} The element.
     */
    create: function (str) {
        try {
            var tag = str.match(/^[\w\-]+/)[0],
                ele = document.createElement(tag),
                index = null,
                arr = null;
            str = str.slice(tag.length);
            index = str.indexOf('{');
            if (index !== -1) {
                ele.html(str.slice(index + 1, str.lastIndexOf('}')));
                str = str.slice(0, index);
            }
            index = str.indexOf('.');
            if (index !== -1) {
                arr = str.split('.');
                str = arr.shift();
                Loop.each(arr, ele.addClass, ele);
            }
            if (str.match(/^#/)) {
                ele.id = str.slice(1);
            }
            return ele;
        } catch (err) {
            return null;
        }
    },
    /**
     * @description The method which is similar to document.querySelectorAll.
     * @param {string} selector The DOM selector.
     * @param {boolean} ignoreError Whether to ignore the errors. (If false, this method will return null on error.)
     * @returns {Array<Element>} The result of document.querySelectorAll.
     */
    select: function (selector, ignoreError) {
        try {
            return Array.from(document.querySelectorAll(selector));
        } catch (err) {
            if (ignoreError === false) {
                throw err;
            } else {
                return null;
            }
        }
    },
    /**
     * @description Dispatch an event to the element.
     * @argument {Element} ele The element.
     * @argument {string} type Event type.
     * @argument {boolean} cancelable Whether the event is cancelable.
     * @param {boolean} canBubble Whether the event can bubble.
     * @returns {boolean} Whether the event is successfully dispatched.
     */
    trigger: function (ele, type, cancelable, canBubble) {
        var e = document.createEvent('HTMLEvents');
        e.initEvent(type, canBubble, cancelable)
        return ele.dispatchEvent ? ele.dispatchEvent(e) : false;
    },
    // Equals to document.on('ready', $listener, $useCapture).
    ready: function (listener, useCapture) {
        return document.on('ready', listener, useCapture);
    },
    // Equals to window.listen('load', $listener, $useCapture).
    load: function (listener, useCapture) {
        return window.listen('load', listener, useCapture);
    },
    /**
     * @description Custom events.
     * @type {{ [x: string] : (ele: Element, listener: (e) => any, useCapture: boolean) }}
     */
    CustomEvents: {
        // DOMContentLoaded
        ready: function (ele, listener, useCapture) {
            if (/interactive|complete|loaded/.test(document.readyState)) {
                document._DOMReady_ = true;
            }
            if (document._DOMReady_) {
                setTimeout(listener);
            }
            ele.listen('DOMContentLoaded', function (e) {
                if (document._DOMReady_) {
                    return;
                }
                document._DOMReady_ = true;
                listener();
            }, useCapture);
            document.listen('readystatechange', function (e) {
                if (document._DOMReady_) {
                    return;
                }
                if (/interactive|loaded|complete/.test(document.readyState)) {
                    document._DOMReady_ = true;
                    listener();
                }
            }, useCapture);
            window.listen('load', function () {
                if (document._DOMReady_) {
                    return;
                }
                document._DOMReady_ = true;
                listener();
            });
        },
        // value change
        change: function (ele, listener, useCapture) {
            var lastValue = NaN;
            ele.listen('blur', function () {
                if (ele.value !== lastValue) {
                    listener();
                    lastValue = ele.value;
                }
            }, useCapture);
        },
        // pointer
        pointerdown: function (ele, listener, useCapture) {
            ele.listen('mousedown', function (e) {
                var x = e.clientX,
                    y = e.clientY;
                listener.call(this, e, x, y);
            }, useCapture);
            ele.listen('touchstart', function (e) {
                var touches = e.changedTouches || e.touches,
                    x = touches[0] ? touches[0].clientX : null,
                    y = touches[0] ? touches[0].clientY : null;
                listener.call(this, e, x, y);
            }, useCapture);
        },
        pointermove: function (ele, listener, useCapture) {
            ele.listen('mousemove', function (e) {
                var x = e.clientX,
                    y = e.clientY;
                listener.call(this, e, x, y);
            }, useCapture);
            ele.listen('touchmove', function (e) {
                var touches = e.changedTouches || e.touches,
                    x = touches[0] ? touches[0].clientX : null,
                    y = touches[0] ? touches[0].clientY : null;
                listener.call(this, e, x, y);
            }, useCapture);
        },
        pointerup: function (ele, listener, useCapture) {
            ele.listen('mouseup', function (e) {
                var x = e.clientX,
                    y = e.clientY;
                listener.call(this, e, x, y);
            }, useCapture);
            ele.listen('touchend', function (e) {
                var touches = e.changedTouches || e.touches,
                    x = touches[0] ? touches[0].clientX : null,
                    y = touches[0] ? touches[0].clientY : null;
                listener.call(this, e, x, y);
            }, useCapture);
        }
    }
};

/** @description This object has some methods or constructors about animations */
var Ani = {
    /**
     * @description The constructor of animation frames.
     * @property {number} fps How many times the frame will be updated per second.
     * @property {boolean} isRunning Whether the frame is running.
     * @property {number} lastUpdateTime Last time the frame is updated.
     * @property {number} lastUpdateGap Last gap the frame is updated.
     * @property {number} lastFrameDuration Last duration the frame lasts.
     * @method start To start updating the frame.
     * @method stop To stop updating the frame.
     * @method listen To add a listener to the frame.
     * @method listenOnce To add a listener to the frame which will be called only once.
     * @method ignore To ignore a listener.
     * @method ignoreType To ignore listeners of the type.
     * @method ignoreAll To ignore all the listeners.
     */
    Frame: new Constructor(
        function () {
            var isRunning = false,
                lastUpdateTime = null,
                lastUpdateGap = null,
                lastFrameDuration = null,
                agency = new Agency();
            var run = function () {
                if (!isRunning || typeof this.fps !== 'number') {
                    return;
                }
                var startTime = +new Date();
                if (lastUpdateTime) {
                    lastUpdateGap = startTime - lastUpdateTime;
                }
                lastUpdateTime = startTime;
                agency.trigger('update', +new Date());
                var endTime = +new Date();
                lastFrameDuration = endTime - startTime;
                setTimeout(this.usingRAF ? function () {
                    requestAnimationFrame(run);
                } : run, Math.max(0, 1000 / this.fps - lastFrameDuration));
            }.bind(this);
            this.fps = 40;
            this.usingRAF = true;
            this.start = function () {
                if (!isRunning) {
                    isRunning = true;
                    agency.trigger('start', +new Date());
                    setTimeout(run);
                }
                return this;
            };
            this.stop = function () {
                if (isRunning) {
                    isRunning = false;
                    agency.trigger('stop', +new Date());
                }
                return this;
            };
            Object.defineProperties(this, {
                isRunning: { get: function () { return isRunning; } },
                lastUpdateTime: { get: function () { return lastUpdateTime; } },
                lastUpdateGap: { get: function () { return lastUpdateGap; } },
                lastFrameDuration: { get: function () { return lastFrameDuration; } }
            });
            Loop.each(['listen', 'listenOnce', 'ignore', 'ignoreType', 'ignoreAll'], function (m) {
                this[m] = function () {
                    agency[m].apply(agency, arguments);
                    return this;
                };
            }, this);
        }, {
            /**
             * @description To update the frame once.
             * @returns {Ani.Frame} Self.
             */
            update: function () {
                return this.listen('update', this.stop).start();
            },
            /**
             * @description To set the fps.
             * @param {number} fps The value.
             * @returns {Ani.Frame} Self.
             */
            setFps: function (fps) {
                this.fps = fps;
                return this;
            }
        }
    ),
    /**
     * @description To create a animation. (Will start it immediately.)
     * @param {number} fps The fps of the animation.
     * @param {Function} updater The updating function.
     * @returns {Ani.Frame} The animation.
     */
    createFrame: function (fps, updater) {
        var frame = new Ani.Frame();
        frame.fps = fps;
        return frame.listen('update', updater).start();
    },
    /**
     * @description To get the timing function by giving the string. (linear, ease, ease-in|easeIn, ease-out|easeOut, ease-in-out|easeInOut, steps($count, $start), cubic(x0, y0, x1, y1))
     * @param {string} str The string.
     * @returns {Function} The timing function.
     */
    getFn: function (str) {
        if (typeof str !== 'string') {
            return null;
        }
        switch (str.toLowerCase()) {
            case 'linear':
                return Ani.linear;
            case 'ease':
                return Ani.ease;
            case 'ease-in':
            case 'easeIn':
                return Ani.easeIn;
            case 'ease-out':
            case 'easeOut':
                return Ani.easeOut;
            case 'ease-in-out':
            case 'easeInOut':
                return Ani.easeInOut;
            default:
                if (str.match('cubic')) {
                    str = str.replace(/\s/g, '').str.slice(str.indexOf('(') + 1, str.indexOf(')'));
                    var arr = str.split(',').map(function (v) { return v - 0; });
                    return Ani.cubic(arr[0], arr[1], arr[2], arr[3]);
                } else if (str.match('steps')) {
                    str = str.replace(/\s/g, '').str.slice(str.indexOf('(') + 1, str.indexOf(')'));
                    var arr = str.split(',').map(function (v) { return v - 0; });
                    return Ani.steps(arr[0], arr[1]);
                } else {
                    return null;
                }
        }
    },
    /**
     * @description The constructor of transition animations.
     * @param {{from: number, to: number, dur: number, fps: number, fn: (at: number) => number, transferer: (value: any) => any}} config The config.
     * @property {Ani.Frame} frame The frame.
     * @property {Agency} agency The agency.
     */
    Transition: function (config) {
        var ele = this,
            agency = new Agency(),
            frame = new Ani.Frame(),
            from = config.from,
            to = config.to,
            dur = config.dur,
            fps = config.fps,
            fn = config.fn,
            transferer = config.transferer || false,
            startTime = +new Date();
        if (from == undefined) {
            from = 0;
        }
        if (typeof from === 'string') {
            from -= 0;
        }
        if (typeof to === 'string') {
            to -= 0;
        }
        if (typeof dur !== 'number') {
            dur = 1000;
        }
        if (typeof fps !== 'number') {
            fps = 40;
        }
        if (!(fn instanceof Function)) {
            fn = Ani.getFn(fn) || Ani.linear;
        }
        frame.fps = 50;
        frame.listen('update', function (now) {
            var at = (now - startTime) / dur,
                value = from + (to - from) * fn(at);
            if (transferer) {
                value = transferer(value);
            }
            agency.trigger('update', [value]);
            if (at >= 1) {
                frame.stop();
                agency.trigger('update', from + (to - from) * fn(1));
            }
        });
        frame.listen('stop', function () {
            agency.trigger('stop');
        });
        setTimeout(function () {
            agency.trigger('update', from + (to - from) * fn(0));
        });
        frame.start();
        this.frame = frame;
        this.agency = agency;
        this.start = frame.start.bind(frame);
        this.stop = frame.stop.bind(frame);
        agency.bind(this);
    },
    /**
     * @description To create a transition.
     * @param {Object} config The config. (See Ani.Transition)
     * @param {(value: any) => void} updater The updating function.
     * @returns {Ani.Transition} The transition.
     */
    createTransition: function (config, updater) {
        var tran = new Ani.Transition(config);
        tran.listen('update', updater);
        return tran;
    },
    /**
     * @description The accuracy of cubic timing functions.
     * @type {number} The accuracy.
     */
    cubicAccuracy: .01,
    /**
     * @description To create a timing function of cubic(x0, y0, x1, y2).
     * @param {number} x0 x0.
     * @param {number} y0 y0.
     * @param {number} x1 x1.
     * @param {number} y1 y1.
     * @returns {(at: number) => number} The timing function.
     */
    cubic: function (x0, y0, x1, y1) {
        var limit = Ani.cubicAccuracy;
        if (x0 > 1) {
            x0 = 1;
        } else if (x0 < 0) {
            x0 = 0;
        }
        if (x1 > 1) {
            x1 = 1;
        } else if (x1 < 0) {
            x1 = 0;
        }
        var calc = function (t) {
            var x = [0, x0, x1, 1],
                y = [0, y0, y1, 1],
                c = 3;
            while (c > 0) {
                var _x = [],
                    _y = [];
                for (var i = 0; i < c; i++) {
                    _x[i] = x[i] + (x[i + 1] - x[i]) * t;
                    _y[i] = y[i] + (y[i + 1] - y[i]) * t;
                }
                x = _x;
                y = _y;
                c--;
            }
            return {
                x: x[0],
                y: y[0]
            };
        };
        var find = function (x, left, right) {
            var mid = (left + right) / 2,
                ans = calc(mid);
            if (Math.abs(ans.x - x) <= limit) {
                return ans.y;
            } else {
                try {
                    if (ans.x > x) {
                        return find(x, left, mid);
                    } else {
                        return find(x, mid, right);
                    }
                } catch (err) {
                    return ans.y;
                }
            }
        };
        return function (at) {
            return find(at, 0, 1);
        };
    },
    /**
     * @description The timing function of animations.
     * @param {number} at (now - start) / dur
     * @returns {number} The value.
     */
    linear: function (at) {
        return at;
    },
    /**
     * @description To get a timing function of steps($count, $start).
     * @param {number} count How many steps.
     * @param {boolean} start Whether to jump at start.
     * @returns {Function} The timing function.
     */
    steps: function (count, start) {
        start = start || false;
        var gap = 1 / count;
        return start ? function (at) {
            return Math.ceil(at / gap) * gap;
        } : function (at) {
            return Math.floor(at / gap) * gap;
        };
    }
};
// other timing functions
Loop.each({
    ease: Ani.cubic(.25, 1, .25, 1),
    easeIn: Ani.cubic(.42, 0, 1, 1),
    easeOut: Ani.cubic(0, 0, .58, 1),
    easeInOut: Ani.cubic(.42, 0, .58, 1)
}, function (v, k) {
    Ani[k] = v;
});

//#region - extend elements

/**
 * @description Append the element to another element;
 * @param {Element} parent Another element.
 * @returns {Element} Self.
 */
Element.prototype.appendTo = function (parent) {
    parent.appendChild(this);
    return this;
};
/**
 * @description To get/set an attribute of the element.
 * @argument {string} name The name of the attribute.
 * @param {string|undefined} value The value of the attribute.
 * @returns {string|Element} Return the value of the attribute if the value is not given, self otherwise.
 */
Element.prototype.attr = function (name, value) {
    if (arguments.length === 1) {
        return this.getAttribute(name);
    } else {
        this.setAttribute(name, value);
        return this;
    }
};
/**
 * @description To get/set the style of the element.
 * @argument {string} name The name of the style.
 * @param {string|undefined} value The value of the style.
 * @returns {string|Element} Return the value of the style if the value is not given, self otherwise.
 */
Element.prototype.css = function (name, value) {
    if (arguments.length === 1) {
        return this.style[name];
    } else {
        this.style[name] = value;
        return this;
    }
};
/**
 * @description To get the abbr of the element.
 * @returns {string} The abbr of the element.
 */
Element.prototype.toAbbr = function () {
    var id = this.id,
        cls = Array.from(this.classList).join('.');
    return this.tagName.toLowerCase() + (id ? '#' + id : '') + (cls ? '.' + cls : '');
};
/**
 * @description To add a new class to the element. (Will ignore if the element has the class.)
 * @param {string} name The class name to add.
 * @returns {Element} Self.
 */
Element.prototype.addClass = function (name) {
    var classes = this.attr('class');
    if (!classes) {
        this.attr('class', name);
    } else {
        classes = classes.split(/\s+/);
        if (classes.indexOf(name) === -1) {
            classes.push(name);
            this.attr('class', classes.join(' '));
        }
    }
    return this;
};
/**
 * @description To remove a class from the element.
 * @param {string} name The class to remove.
 * @returns {Element} Self.
 */
Element.prototype.delClass = function (name) {
    var classArr = (this.attr('class') || '').split(' ');
    classArr = Loop.filter(classArr, function (c) {
        return c !== name;
    });
    this.attr('class', classArr.join(' '));
    return this;
};
/**
 * @description To change the disabled value of the element.
 * @param {boolean} disabled Whether the element should be disabled. If the value is not given, the method will change the value from true to false (or: from true to false).
 * @returns {Element} Self.
 */
Element.prototype.disable = function (disabled) {
    this.disabled = disabled === undefined ? disabled : !this.disabled;
    return this;
};
/**
 * @description To get/set the innerHTML property of the element.
 * @param {string} value The innerHTML value to replace.
 * @returns {Element|string}  If the value is not given, the method will return the innerHTML, the element otherwise.
 */
Element.prototype.html = function (value) {
    if (arguments.length === 0) {
        return this.innerHTML;
    } else {
        this.innerHTML = value;
        return this;
    }
};
/**
 * @description To hide the element.
 * @returns {Element} Self.
 */
Element.prototype.hide = function () {
    return this.css('display', 'none');
};
/**
 * @description To display the Element.
 * @param {string} display The value of the css attribute 'display' of the element.
 * @returns {Element} Self.
 */
Element.prototype.show = function (display) {
    display = display || 'block';
    return this.css('display', display);
};
/**
 * @description To remove the element.
 * @returns {Element} Self.
 */
Element.prototype.remove = function () {
    return this.parentNode.removeChild(this);
};
/**
 * @description To get the generation of the element.
 * @returns {Element} Self.
 */
Element.prototype.generation = function () {
    return this.parentNode.children;
};
/**
 * @description To get the previous element.
 * @returns {Element|null} Previous element if exists, null otherwise.
 */
Element.prototype.prev = function () {
    var c = this.parentNode.children,
        i = Array.from(c).indexOf(this);
    return i === 0 ? null : c[i - 1];
};
/**
 * @description To get the next element.
 * @returns {Element|null} Next element if exists, null otherwise.
 */
Element.prototype.next = function () {
    var c = this.parentNode.children,
        i = Array.from(c).indexOf(this);
    return i === c.length - 1 ? null : c[i + 1];
};
/**
 * @description To set the scroll offset of the element.
 * @argument {number} offsetX The offset x.
 * @param {number|undefined} offsetY The offset y. Will set to offsetX if the value is not given.
 * @returns {Element} Self.
 */
Element.prototype.scroll = function (offsetX, offsetY) {
    if (offsetY === undefined) {
        offsetY = offsetX;
    }
    this.scrollLeft += offsetX;
    this.scrollTop += offsetY;
    return this;
};
/**
 * @description To insert to the children of another element.
 * @argument {number} index The index.
 * @param {Element} parent The parent element.
 * @returns {Element} Self.
 */
Element.prototype.insertTo = function (index, parent) {
    parent.insertBefore(this, parent.children[index]);
    return this;
};
/**
 * @description To insert an element to the children of the element.
 * @argument {number} index The index.
 * @param {Element} child The child element.
 * @returns {Element} Self.
 */
Element.prototype.insertChild = function (index, child) {
    this.insertBefore(child, this.children[index]);
    return this;
};
/**
 * @description To tell whether the element can/will be seen.
 * @param {number} gap The gap between the bounding client rect of the element and the view. (default value is 0.)
 * @returns {Element} Self.
 */
Element.prototype.isSeen = function (gap) {
    if (typeof gap !== 'number') {
        gap = 0;
    }
    var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
        scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
        eleTop = this.offsetTop,
        eleLeft = this.offsetLeft;
    return scrollTop + window.innerHeight + gap >= eleTop &&
        scrollTop <= eleTop + this.getBoundingClientRect().height + gap &&
        scrollLeft + window.innerWidth + gap >= eleLeft &&
        scrollLeft <= eleLeft + this.getBoundingClientRect().width + gap;
};
/**
 * @description To set/get the value of the element.
 * @param {string|undefined} val The value to set.
 * @returns {string|Element} Self if the value is given, the value of the element otherwise.
 */
Element.prototype.val = function (val) {
    if (arguments.length === 0) {
        return this.value;
    }
    this.value = '' + val;
    DOM.trigger(this, 'input');
    return this;
};
/**
 * @description To create an animation of the element. (Will start the animation immediately.)
 * @param {{style: string, unit: string}} config The config. (For more properties, see Ani.Transition)
 * @returns {Ani.Transition} The animation.
 */
Element.prototype.ani = function (config) {
    var ele = this,
        tran = new Ani.Transition(config);
    tran.agency.listen('update', function (val) {
        ele.style[config.style] = val + config.unit || 'px';
    });
    return tran;
};
/**
 * @description To let the element fade out.
 * @param {{dur: number, fps: number, fn: (at: number) => number}} config The config.
 * @returns {Element} Self.
 */
Element.prototype.fadeOut = function (config) {
    var ele = this;
    config = config || {};
    return this.ani({
        style: 'opacity',
        from: config.from || 1,
        to: 0,
        unit: '',
        fps: config.fps || 32,
        dur: config.dur || 1000,
        fn: config.fn
    }).listen('stop', function () {
        ele.hide();
    });
};
/**
 * @description To let the element fade in.
 * @param {{dur: number, fps: number, display: string, fn: (at: number) => number}} config The config.
 * @returns {Element} Self.
 */
Element.prototype.fadeIn = function (config) {
    var ele = this;
    config = config || {};
    ele.show(config.display || 'block');
    return this.ani({
        style: 'opacity',
        from: config.from || 0,
        to: 1,
        unit: '',
        fps: config.fps || 32,
        dur: config.dur || 1000,
        fn: config.fn
    });
};
// extend elements, documents and windows.
Loop.each([
    Element,
    Document,
    Window
], function (O) {
    /**
     * @description To add a listener to the object.
     * @param {string} type Event type.
     * @param {(e: Event) => any} listener The listener.
     * @param {boolean} useCapture Whether to use capture.
     * @returns {O} Self.
     */
    O.prototype.listen = O.prototype.addEventListener === undefined ? function (type, listener) {
        this['on' + type] = listener;
        return this;
    } : function (type, listener, useCapture) {
        this.addEventListener(type, listener, useCapture);
        return this;
    };
    /**
     * @description To remove a listener from the object.
     * @argument {string} type Event type.
     * @argument {(e: Event) => any} listener The listener.
     * @param {boolean} useCapture Whether to use capture.
     * @returns {O} Self.
     */
    O.prototype.ignore = O.prototype.removeEventListener === undefined ? function (type, listener) {
        type = 'on' + type;
        if (this[type] === listener) {
            this[type] = null;
        }
        return this;
    } : function (type, listener, useCapture) {
        this.removeEventListener(type, listener, useCapture);
        return this;
    };
    Loop.each({
        /**
         * @description Add listener to the object. If the type has not been defined in DOM.CustomEvents, this method equals O.prototype.listen.
         * @argument {string} type Custom event type.
         * @argument {(e: Event) => any} listener The listener.
         * @param {boolean} useCapture Whether to use capture.
         * @returns {O} Self.
         */
        on: function (type, listener, useCapture) {
            if (type in DOM.CustomEvents) {
                DOM.CustomEvents[type](this, listener, useCapture);
            } else {
                this.listen(type, listener, useCapture);
            }
            return this;
        },
        /**
         * @description To trigger an event.
         * @argument {string} type Event type.
         * @argument {boolean} cancelable Whether the event is cancelable.
         * @param {boolean} canBubble Whether the event can bubble.
         * @returns {boolean} Whether the event is successfully dispatched.
         */
        trigger: function (type, cancelable, canBubble) {
            return DOM.trigger(this, type, cancelable, canBubble);
        }
    }, function (ext, key) {
        O.prototype[key] = ext;
    });
});

//#endregion

/**  @description This object has some methods or constructors about ajax. */
var Ajax = {
    /**
     * @description The constructor of ajax results 
     * @param {Event} e The event of XMLHttpRequest.prototype.onload.
     * @param {number} start The start time of the request.
     * @param {number} finish The finish time of the request.
     * @property {Event} event The event from argument.
     * @property {XMLHttpRequest} request The target of the event.
     * @property {string} response The response of the request.
     * @property {number} startTime The start time of the request.
     * @property {number} finishTime The finish time of the request.
     * @property {number} status The status of the request.
     */
    Result: new Constructor(
        function (e, start, end) {
            Object.defineProperties(this, {
                e: { value: e },
                request: { value: e.target },
                response: {
                    get: function () {
                        return e.target.response;
                    }
                },
                startTime: { value: start },
                finishTime: { value: end },
                status: { value: e.target.status }
            });
        }, {
            /**
             * @description The method that tries to transfer the response to object.
             * @returns {Promise} The promise which tells whether the transference is successful.
             */
            json: function () {
                var result = this;
                return new Promise(function (resolve, reject) {
                    try {
                        resolve(JSON.parse(result.response));
                    } catch (err) {
                        reject(err);
                    }
                });
            }
        }
    ),
    /**
     * @description The config of ajax request.
     * @param {string} url The url of the request.
     * @property {string} method The method of the request.
     * @property {string} url The url of the request.
     * @property {{[key: string]: string}} params The params will be appended to the url.
     * @property {any} data  The data to send.
     * @property {boolean} async Whether to send an async request.
     * @property {string} user The user of the request.
     * @property {string} password The password of the request.
     * @property {xhr: XMLHttpRequest) => void} beforeSend The function that will be called before sending the request.
     * @property {boolean} transferData Whether to transfer the data.
     * @property {boolean} transferResult Whether to transfer the result.
     */
    Config: new Constructor(
        function (url) {
            this.method = 'GET';
            this.url = url || null;
            this.data = '';
            this.async = true;
            this.user = '';
            this.password = '';
            this.beforeSend = null;
            this.transferData = true;
            this.transferResult = true;
            this.params = {};
        }, {
            /**
             * @description To set config by an object.
             * @param {Ajax.Config} settings Settings of the config.
             * @returns {Ajax.Config} Self.
             */
            set: function (settings) {
                Loop.each(settings, function (v, k) {
                    if (k in this) {
                        this[k] = v;
                    }
                }, this);
                return this;
            }
        }
    ),
    /** 
     * @description This method sends an XMLHttpRequest and returns a promise.
     * @param {Ajax.Config} config Settings about the request.
     * @returns {Promise} The promise which tells whether the request is successful.
     */
    send: function (config) {
        if (!(window.XMLHttpRequest && config && (config instanceof Object) && config.url)) {
            return;
        }
        return new Promise(function (resolve, reject) {
            config = (new Ajax.Config()).set(config);
            try {
                var xhr = new XMLHttpRequest();
                if (JSON.stringify(config.params) !== '{}') {
                    config.url = Ajax.joinParams(config.url, config.params);
                }
                xhr.open(config.method, config.url, config.async === true, config.user, config.password);
                xhr.onabort = reject;
                xhr.onerror = reject;
                xhr.ontimeout = reject;
                xhr.onload = function (e) {
                    if (xhr.status == 200) {
                        resolve(config.transferResult === false ? e : new Ajax.Result(e, startTime, +new Date()));
                    } else {
                        reject(e);
                    }
                };
                if (config.beforeSend) {
                    config.beforeSend(xhr);
                }
                xhr.send(config.transferData === false ? config.data : JSON.stringify(config.data));
                var startTime = +new Date();
            } catch (err) {
                reject(err);
            }
        });
    },
    /**
     * @description To parse an URL.
     * @param {string} url The url.
     * @returns {{href: string, src: string, protocol: string, hash: string, file: string, prot: string, host: string, get_a: () => HTMLAnchorElement, args: {[key: string]: string, ext: string}}} The result.
     */
    parseURL: function (url) {
        url = url || document.URL;
        var o = {},
            index = -1,
            a = document.createElement('a');
        a.href = url || document.URL;
        o.src = a.href;
        o.protocol = a.protocol.slice(0, -1);
        o.hash = a.hash.slice(1);
        o.file = a.pathname;
        if (o.file[0] === '/' || o.file[0] === '\\') {
            o.file = o.file.slice(1);
        }
        index = o.file.lastIndexOf('/');
        if (index !== -1) {
            o.file = o.file.slice(index + 1);
        }
        o.port = a.port;
        o.host = a.host;
        index = o.host.lastIndexOf(':');
        if (index !== -1) {
            o.host = o.host.split('');
            o.host.splice(index);
            o.host = o.host.join('');
        }
        o.get_a = function () {
            return a;
        };
        var args = a.search.slice(1).split('&');
        o.args = {};
        for (var arg; arg = args.shift();) {
            arg = arg.split('=');
            o.args[arg[0]] = arg[1];
        }
        index = o.file.lastIndexOf('.');
        o.ext = index === -1 ? '' : o.file.slice(index + 1).toLowerCase();
        return o;
    },
    /**
     * @description To join params into string.
     * @param {string} url The url. (If you skip this argument, the url will set to ''.)
     * @param {{[key: string]: string}} params The params.
     * @returns {string} The result.
     */
    joinParams: function (url, params) {
        if (arguments.length === 0) {
            return null;
        } else if (arguments.length === 1) {
            params = url;
            url = '';
        }
        url += url.indexOf('?') === -1 ? '?' : '&';
        var i = 0;
        Loop.each(params, function (value, key) {
            if (i++ > 0) {
                url += '&';
            }
            url += encodeURI(key) + '=' + encodeURI(value);
        });
        return url;
    }
};

/** @description This object has some methods to load scripts. */
var Script = {
    /** 
     * @description The include path.
     * @type {string}
     */
    includePath: '',
    /**
     * @description The method to load a script file.
     * @param {string} url The url of the script file.
     * @param {string} type The type of the script file.
     * @param {boolean} useIncludePath Whether to use the include path.
     * @returns {Promise} The promise tells whether the script file has loaded successfully.
     */
    loadOne: function (url, type, useIncludePath) {
        if (typeof url !== 'string') {
            return;
        }
        return new Promise(function (resolve, reject) {
            try {
                if (useIncludePath !== false) {
                    url = Script.includePath + url;
                }
                var scriptTag = document.createElement('script');
                scriptTag.type = type || 'text/javascript';
                scriptTag.src = url;
                scriptTag.onload = resolve;
                scriptTag.onabort = reject;
                scriptTag.onerror = reject;
                (document.body || document.head).appendChild(scriptTag);
            } catch (err) {
                reject(err);
            }
        });
    },
    /**
     * @description The method to load script files.
     * @argument {Array} url The urls of the script files.
     * @argument {boolean} sequentially Whether to load the script files in sequence.
     * @argument {string} type The type of the script files.
     * @param {boolean} useIncludePath Whether to use the include path.
     * @returns {Promise} The promise tells whether all the script files have loaded successfully.
     */
    loadSome: function (urls, sequentially, type, useIncludePath) {
        if (sequentially !== false) {
            return new Promise(function (resolve, reject) {
                var ans = [];
                var next = function () {
                    if (urls.length <= 0) {
                        resolve(ans);
                    }
                    var url = urls.shift();
                    Script.loadOne(url, type, useIncludePath).then(function (data) {
                        ans.push(data);
                        return next();
                    }, reject);
                };
                next();
            });
        } else {
            return Promise.all(Loop.map(urls, function (url) {
                return Script.loadOne(url, type, useIncludePath);
            }));
        }
    },
    /**
     * @description The method to load script files in group.
     * @argument {Array} url The array of the url groups of the script files.
     * @argument {string} type The type of the script files.
     * @param {boolean} useIncludePath Whether to use the include path.
     * @returns {Promise} The promise tells whether all the script file groups have loaded successfully.
     */
    loadGroup: function (urlArr, type, useIncludePath) {
        return new Promise(function (resolve, reject) {
            var ans = [];
            var next = function () {
                if (urlArr.length <= 0) {
                    resolve(ans);
                }
                var urls = urlArr.shift();
                Script.loadSome(urls, false, type, useIncludePath).then(function (data) {
                    ans.push(data);
                    return next();
                }, reject);
            };
            next();
        });
    }
};

/** @description This object has some methods about extensions. */
var Extension = (function () {
    var exportations = {},
        waiters = [];
    var checkWaiters = function () {
        var _waiters = [];
        waiters.forEach(function (w) {
            if (!w()) {
                _waiters.push(w);
            }
        });
        waiters = _waiters;
    };
    // The object to return.
    var o = {};
    /**
     * @description To export sth.
     * @param {string} name The name.
     * @param {any} value The value.
     * @returns {boolean} Whether it is successfully exported.
     */
    o.export = function (name, value) {
        if (name in exportations) {
            return false;
        }
        if (arguments.length === 1) {
            value = name;
        }
        exportations[name] = value;
        checkWaiters();
        return true;
    };
    /**
     * @description To get an extension.
     * @param {string} name The name of the extension.
     * @returns {any} The extension if exists, null otherwise.
     */
    o.import = function (name) {
        if (name in exportations) {
            return exportations[name];
        }
        return null;
    };
    /**
     * @description To define a new extension.
     * @param {string} name The name of the extension.
     * @param {Array<string>} need The need list.
     * @param {Function} definer The function defines the extension.
     * @returns {boolean} Whether it is executed at once.
     */
    o.define = function (name, need, definer) {
        return o.need(need, function () {
            o.export(name, definer.apply(this, arguments));
        });
    };
    /**
     * @description To execute the callback when all the extensions in the need list have been defined.
     * @param {Array<string>} need The need list.
     * @param {Function} callback The callback.
     * @returns {boolean} Whether it is executed at once.
     */
    o.need = function (need, callback) {
        var requirements = new Array(need.length);
        for (var i = 0; i < need.length; i++) {
            if (!(need[i] in exportations)) {
                waiters.push(function () {
                    for (var i = 0; i < need.length; i++) {
                        if (!(need[i] in exportations)) {
                            return false;
                        } else {
                            requirements[i] = exportations[need[i]];
                        }
                    }
                    setImmediate.apply(window, [callback].concat(requirements));
                    return true;
                });
                return false;
            } else {
                requirements[i] = exportations[need[i]];
            }
        }
        callback.apply(null, requirements);
        return true;
    };
    return o;
})();