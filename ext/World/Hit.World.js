/**
 * @file Hit.World.js
 * @see https://github.com/huang2002/Hit.js
 * @author hhh
 * @overview This file defined a simple 2d physical engine.
 */

Extension.define('World', [], function () {
    "use strict";

    // The constructor of objects that have the ability to listen on collision events.
    var CollisionTarget = new Constructor(
        function () {
            this.collisionListeners = {};
        }, {
            /**
             * @description To add a collision listener to the item.
             * @param {string} tag The tag of that item. (Use '*' to listen on all the collisions.)
             * @param {(thatItem:Item)=>void} listener The listener.
             * @returns {Item} This item.
             */
            addCollisionListener: function (tag, listener) {
                tag = '' + tag;
                var listeners = this.collisionListeners;
                if (tag in listeners) {
                    listeners[tag].add(listener);
                } else {
                    listeners[tag] = new Set([listener]);
                }
                return this;
            },
            /**
             * @description To remove a collision listener from the item.
             * @param {string} tag The tag which was used when you add the listener.
             * @param {(thatItem:Item)=>void} listener The listener.
             * @returns {Item} This item.
             */
            removeCollisionListener: function (tag, listener) {
                var listeners = this.collisionListeners;
                if (tag in listeners) {
                    listeners[tag].delete(listener);
                }
                return this;
            },
            /**
             * @description To trigger the collision event.
             * @param {Item} item That item.
             * @returns {CollisionTarget} This object itself.
             */
            collideWith: function (item) {
                var tag = item.tag,
                    listeners = this.collisionListeners;
                Loop.each([tag, '*'], function (t) {
                    if (t in listeners) {
                        listeners[t].forEach(function (callback) {
                            callback(item);
                        });
                    }
                });
                return this;
            }
        }
    );

    /**
     * @description The constructor that you can employ to create an items container.
     */
    var World = new Constructor(
        function () {
            this.items = new Set();
            this.lastUpdateTime = null;
            this.updateBasis = 16;
        }, {
            /**
             * @description To init the world.
             * @returns {World} The world itself.
             */
            init: function () {
                this.lastUpdateTime = +new Date();
                this.items.forEach(function (item) {
                    item.trigger('init');
                });
                return this;
            },
            /**
             * @description To update the world and check the collisions. (The items will receive an update event.)
             * @param {number} ratio [Optional] The ratio. (The ratio that the items receive will be updateBasis/updateGap*ratio)
             * @returns {World} The world itself.
             */
            update: function (ratio) {
                var now = +new Date(),
                    gap = now - this.lastUpdateTime,
                    rat = gap / this.updateBasis;
                if (typeof ratio === 'number') {
                    rat *= ratio;
                }
                this.lastUpdateTime = now;
                this.items.forEach(function (item) {
                    item.trigger('update');
                    item.update(rat);
                });
                return this;
            },
            /**
             * @description To check the collisions in the world.
             * @param {Set<string>} tags [Optional] The set that contains the tags of the items that should be checked. (Use '*' to check all the items.)
             * @returns {World} The world itself.
             */
            checkCollisions: function (tags) {
                tags = tags || new Set('*');
                var items = this.items,
                    bin = new Set(),
                    dist = Math.distance_p;
                items.forEach(function (thisItem) {
                    var thisPos = thisItem.pos;
                    bin.add(thisItem);
                    if (!thisItem.matchTags(tags)) {
                        return;
                    }
                    items.forEach(function (thatItem) {
                        if (bin.has(thatItem)) {
                            return;
                        }
                        if (!thatItem.matchTags(tags)) {
                            return bin.add(thatItem);
                        }
                        var thatPos = thatItem.pos;
                        if (dist(thisPos, thatPos) > thisItem.r + thatItem.r) {
                            return;
                        }
                        var ans = thisItem.checkCollision(thatItem);
                        if (ans) {
                            var ansV = ans.reduce(function (v1, v2) {
                                return v1.getLen() < v2.getLen() ? v1 : v2;
                            });
                            thisItem.collideWith(thatItem);
                            thatItem.collideWith(thisItem);
                            var thisActive = thisItem.active,
                                thatActive = thatItem.active;
                            if (thisActive || thatActive) {
                                if (!thisItem.penetrative && thatActive) {
                                    var thatV = thatItem.v.getLen(),
                                        thatM = thatItem.m,
                                        thatAnsV = ansV.clone().scale(-1);
                                    thatItem.pos.addVec(thatAnsV.clone().scale(thisActive ? .5 : 1));
                                    thatItem.v.addVec(thatAnsV.setLen(thatV * thatItem.flex));
                                    thatItem.a.set(0, 0);

                                }
                                if (!thatItem.penetrative && thisActive) {
                                    var thisV = thisItem.v.getLen(),
                                        thisM = thatItem.m,
                                        thisAnsV = ansV;
                                    thisItem.pos.addVec(thisAnsV.clone().scale(thatActive ? .5 : 1));
                                    thisItem.v.addVec(thisAnsV.setLen(thisV * thisItem.flex));
                                    thisItem.a.set(0, 0);
                                }
                            }
                        }
                    });
                });
                return this;
            },
            /**
             * @description To stroke all the items in the world.
             * @param {CanvasRenderingContext2D} ctx The canvas context.
             * @param {Set<string>} tags [Optional] The set of the tags of the items to stroke.
             * @returns {World} The world itself.
             */
            stroke: function (ctx, tags) {
                tags = tags || new Set('*');
                this.items.forEach(function (i) {
                    if (i.matchTags(tags)) {
                        i.getRealOutline().stroke(ctx);
                    }
                });
                return this;
            },
            /**
             * @description To fill all the items in the world.
             * @param {CanvasRenderingContext2D} ctx The canvas context.
             * @param {Set<string>} tags [Optional] The set of the tags of the items to fill.
             * @returns {World} The world itself.
             */
            fill: function (ctx, tags) {
                tags = tags || new Set('*');
                this.items.forEach(function (i) {
                    if (i.matchTags(tags)) {
                        i.getRealOutline().fill(ctx);
                    }
                });
                return this;
            },
            /**
             * @description To draw all the items in the world.
             * @param {CanvasRenderingContext2D} ctx The canvas context.
             * @param {Set<string>} tags [Optional] The set of the tags of the items to draw.
             * @returns {World} The world itself.
             */
            draw: function (ctx, tags) {
                tags = tags || new Set('*');
                this.items.forEach(function (i) {
                    if (i.matchTags(tags)) {
                        i.getRealOutline().draw(ctx);
                    }
                });
                return this;
            },
            /**
             * @description To add an item group.
             * @param {Group} group The group to add.
             * @returns {World} The world itself.
             */
            addGroup: function (group) {
                group.items.forEach(function (item) {
                    this.items.add(item);
                }, this);
                return this;
            },
            /**
             * @description To remove an item group.
             * @param {Group} group The group to remove.
             * @returns {World} The world itself.
             */
            removeGroup: function (group) {
                group.items.forEach(function (item) {
                    this.items.delete(item);
                }, this);
                return this;
            }
        }, [
            CollisionTarget
        ]
    );

    /**
     * @description To check whether the two objects collided with each other (Using SAT). If true, then returns the separating vector(s). Otherwise, returns false. (Please note that the separating vector(s) tell(s) the direction to move o1.)
     * @param {Item} o1 One object.
     * @param {Item} o2 The other object.
     * @returns {Vector|boolean} The result.
     */
    var checkCollision = World.checkCollision = function (o1, o2) {
        var ans = true,
            ansArr = [],
            M = Math,
            PI = M.PI,
            ol1 = o1.getRealOutline(),
            ol2 = o2.getRealOutline(),
            c1 = ol1.isClockwise(),
            c2 = ol2.isClockwise(),
            tempSet = new Set(),
            axisRads = Loop.map(ol1.getEdges(), function (edge) {
                return {
                    r: edge.getRad(),
                    c: c1
                };
            }).concat(Loop.map(ol2.getEdges(), function (edge) {
                return {
                    r: edge.getRad(),
                    c: c2
                };
            }));
        axisRads = Loop.filter(axisRads, function (e) {
            var t = tempSet.size;
            tempSet.add(e.r);
            return tempSet.size > t;
        });
        axisRads.forEach(function (e) {
            if (!ans) {
                return;
            }
            var r = e.r,
                b1 = ol1.clone().rotRad(-r).getBox(),
                b2 = ol2.clone().rotRad(-r).getBox();
            if (b2.r > b1.r) {
                if (b2.x >= b1.r) {
                    ans = false;
                } else {
                    var d = b1.r - b2.x;
                    ansArr.push(
                        new Vector(0, -d).rotRad(r + (e.c ? -1 : 1) * PI / 2)
                    );
                }
            } else {
                if (b1.x >= b2.r) {
                    ans = false;
                } else {
                    var d = b2.r - b1.x;
                    ansArr.push(
                        new Vector(0, d).rotRad(r + (e.c ? -1 : 1) * PI / 2)
                    );
                }
            }
        });
        return ans && ansArr;
    };

    /**
     * @description The constructor of outlines. (Please note that the vertices must be in clockwise or anticlockwise order, and the outline should be convex.)
     * @param {Array<Vector>} vertices [Optional] The vertices.
     */
    var Outline = World.Outline = new Constructor(
        function (vertices) {
            this.vertices = vertices || [];
            this.strokeStyle = 'rgba(0,255,0,.9)';
            this.fillStyle = 'rgba(0,225,255,.1)';
        }, {
            /**
             * @description To add a new vertex.
             * @param {number} x The x component of the vertex.
             * @param {number} y The y component of the vertex.
             * @returns {Outline} The outline itself.
             */
            addVertex: function (x, y) {
                this.vertices.push(new Vector(x, y));
                return this;
            },
            /**
             * @description To add some vertices by sending an array that contains vector-like objects.
             * @param {Array<{x:number,y:number}>} arr
             * @returns {Outline} The outline itself.
             */
            addVertices: function (arr) {
                Loop.each(arr, function (vert) {
                    this.vertices.push(new Vector(vert.x, vert.y));
                }, this);
                return this;
            },
            /**
             * @description To add some vertices by sending an array that contains numbers.
             * @param {Array<number>} arr
             * @returns {Outline} The outline itself.
             */
            addVerticesArr: function (arr) {
                return this.addVertices(
                    arr.split(2).map(function (a) {
                        return {
                            x: a[0],
                            y: a[1]
                        };
                    })
                );
            },
            /**
             * @description To translate the vertices.
             * @param {number} x Delta x.
             * @param {number} y Delta y.
             * @returns {Outline} The outline itself.
             */
            translate: function (x, y) {
                Loop.each(this.vertices, function (vert) {
                    vert.add(x, y);
                });
                return this;
            },
            /**
             * @description To translate the vertices.
             * @param {Vector} v The vector that tells delta x and delta y.
             * @returns {Outline} The outline itself.
             */
            translateVec: function (v) {
                return this.translate(v.x, v.y);
            },
            /**
             * @description To rotate the vertices.
             * @param {number} rad The radian to rotate.
             * @returns {Outline} The outline itself.
             */
            rotRad: function (rad) {
                Loop.each(this.vertices, function (vert) {
                    vert.rotRad(rad);
                });
                return this;
            },
            /**
             * @description To rotate the vertices.
             * @param {number} deg The degree to rotate.
             * @returns {Outline} The outline itself.
             */
            rotDeg: function (deg) {
                return this.rotRad(deg / 180 * Math.PI);
            },
            /**
             * @description To get the bounding box of the outline.
             * @returns {{x:number,y:number,r:number,b:number}} The result.
             */
            getBox: function () {
                var vertArr = this.vertices,
                    xMin = vertArr[0].x,
                    xMax = vertArr[0].x,
                    yMin = vertArr[0].y,
                    yMax = vertArr[0].y;
                Loop.repeat({
                    from: 1,
                    to: vertArr.length - 1
                }, function (i) {
                    var vert = vertArr[i],
                        x = vert.x,
                        y = vert.y;
                    if (x < xMin) {
                        xMin = x;
                    } else if (x > xMax) {
                        xMax = x;
                    }
                    if (y < yMin) {
                        yMin = y;
                    } else if (y > yMax) {
                        yMax = y;
                    }
                });
                return {
                    x: xMin,
                    y: yMin,
                    r: xMax,
                    b: yMax
                };
            },
            /**
             * @description To draw the path of the outline.
             * @param {CanvasRenderingContext2D} ctx The canvas context.
             * @returns {Outline} The outline itself.
             */
            path: function (ctx) {
                Loop.each(this.vertices, function (vert, i) {
                    ctx[i === 0 ? 'moveTo' : 'lineTo'](vert.x, vert.y);
                });
                return this;
            },
            /**
             * @description To stroke the outline.
             * @param {CanvasRenderingContext2D} ctx The canvas context.
             * @returns {Outline} The outline itself.
             */
            stroke: function (ctx) {
                ctx.save();
                ctx.beginPath();
                this.path(ctx);
                ctx.closePath();
                ctx.strokeStyle = this.strokeStyle;
                ctx.stroke();
                ctx.restore();
                return this;
            },
            /**
             * @description To fill the outline.
             * @param {CanvasRenderingContext2D} ctx The canvas context.
             * @returns {Outline} The outline itself.
             */
            fill: function (ctx) {
                ctx.save();
                ctx.beginPath();
                this.path(ctx);
                ctx.closePath();
                ctx.fillStyle = this.fillStyle;
                ctx.fill();
                ctx.restore();
                return this;
            },
            /**
             * @description To draw the outline.
             * @param {CanvasRenderingContext2D} ctx The canvas context.
             * @returns {Outline} The outline itself.
             */
            draw: function (ctx) {
                return this.fill(ctx).stroke(ctx);
            },
            /**
             * @description To tell wether the vertices is clockwise.
             * @returns {boolean} The result.
             */
            isClockwise: function () {
                var v = this.vertices;
                return v.length < 2 || (v[0].getRad() < v[1].getRad());
            },
            /**
             * @description To get the edges of te outline.
             * @returns {Array<Vector>} The result.
             */
            getEdges: function () {
                var arr = this.vertices;
                if (arr.length < 2) {
                    return [];
                }
                return Loop.map(arr, function (cur, i) {
                    var next = arr.at(i + 1);
                    return new Vector(next.x - cur.x, next.y - cur.y);
                });
            },
            /**
             * @description To clone the outline.
             * @returns {Outline} The new outline.
             */
            clone: function () {
                return new Outline(
                    Loop.map(this.vertices, function (v) {
                        return new Vector(v.x, v.y);
                    })
                );
            }
        }
    );
    /**
     * @description To create an array that contains the vertices of a regular polygon.
     * @param {number} n The edges of the regular polygon.
     * @param {number} r The radius of the regular polygon.
     * @returns {Array<Vector>} The result.
     */
    Outline.regPoly = function (n, r) {
        var M = Math,
            ranPerEdge = M.PI * 2 / n,
            FIX = M.PI;
        return Loop.repeat({
            from: .5,
            to: n - .5
        }, function (i) {
            var rad = i * ranPerEdge - FIX;
            return new Vector(
                r * M.sin(rad),
                r * M.cos(rad)
            );
        });
    };
    /**
     * @description To create an array that contains the vertices of a rectangle.
     * @param {number} w The width of the rectangle.
     * @param {number} h The height of the rectangle.
     * @returns {Array<Vector>} The result.
     */
    Outline.rect = function (w, h) {
        w /= 2;
        h /= 2;
        return [
            -w, -h,
            w, -h,
            w, h,
            -w, h
        ];
    };

    /**
     * @description The constructor of vectors.
     * @param {string} x [Optional] The x component.
     * @param {string} y [Optional] The y component.
     */
    var Vector = World.Vector = new Constructor(
        function (x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }, {
            /**
             * @description To set the vector.
             * @param {number} x The x component.
             * @param {number} y The y component.
             * @returns {Vector} The vector itself.
             */
            set: function (x, y) {
                this.x = x;
                this.y = y;
                return this;
            },
            /**
             * @description To set this vector to that vector.
             * @param {Vector} v That vector.
             * @returns {Vector} This vector.
             */
            setVec: function (v) {
                return this.set(v.x, v.y);
            },
            /**
             * @description To add x&y to the components of the vector.
             * @param {number} x The value to be added to the x component of the vector.
             * @param {number} y The value to be added to the y component of the vector.
             * @returns {Vector} The vector itself.
             */
            add: function (x, y) {
                this.x += x;
                this.y += y;
                return this;
            },
            /**
             * @description To add a vector to this vector.
             * @param {Vector} v The vector to be added to this vector.
             * @returns {Vector} This vector.
             */
            addVec: function (v) {
                return this.add(v.x, v.y);
            },
            /**
             * @description To get the length of the vector.
             * @returns {number} The result.
             */
            getLen: function () {
                return Math.distance(0, 0, this.x, this.y);
            },
            /**
             * @description To scale the vector.
             * @param {number} k The scale.
             * @returns {Vector} The vector itself.
             */
            scale: function (k) {
                this.x *= k;
                this.y *= k;
                return this;
            },
            /**
             * @description To set the length of the vector.
             * @param {number} len The target length.
             * @returns {Vector} The vector itself.
             */
            setLen: function (len) {
                return this.scale(len / this.getLen());
            },
            /**
             * @description To get the direction of the vector. (If the length of the vector is zero, will return NaN. Otherwise, returns a number that stands for the clockwise radian. For example, new Vector(0,-1).getDir() === 0.)
             * @returns {number} The result.
             */
            getRad: function () {
                if (!(this.getLen() > 0)) {
                    return NaN;
                }
                var M = Math,
                    PI = M.PI,
                    x = this.x,
                    y = this.y,
                    ans = NaN;
                if (x === 0) {
                    ans = y > 0 ? PI : 0;
                } else if (y === 0) {
                    ans = x > 0 ? PI / 2 : PI * 1.5;
                } else if (x > 0 && y < 0) {
                    ans = M.atan(-x / y);
                } else if (x > 0 && y > 0) {
                    ans = M.atan(y / x) + PI / 2;
                } else if (x < 0 && y > 0) {
                    ans = M.atan(-x / y) + PI;
                } else if (x < 0 && y < 0) {
                    ans = M.atan(y / x) + PI * 1.5;
                }
                return ans % (PI * 2);
            },
            /**
             * @description To get the direction of the vector. (In degree measure.)
             * @returns {number} The result.
             */
            getDeg: function () {
                return this.getRad() / Math.PI * 180;
            },
            /**
             * @description To rotate the vector. (In radian measure.)
             * @param {number} rad The radian to rotate.
             * @returns {Vector} The vector itself.
             */
            rotRad: function (rad) {
                if (this.getLen() > 0) {
                    var M = Math;
                    rad %= M.PI;
                    var r = this.getRad() + rad,
                        l = this.getLen();
                    this.x = l * M.sin(r);
                    this.y = -l * M.cos(r);
                }
                return this;
            },
            /**
             * @description To rotate the vector. (In degree measure.)
             * @param {number} deg The degree to rotate.
             * @returns {Vector} The vector itself.
             */
            rotDeg: function (deg) {
                return this.rotRad(deg / 180 * Math.PI);
            },
            /**
             * @description To clone the vector.
             * @returns {Vector} The new vector.
             */
            clone: function () {
                return new Vector(this.x, this.y);
            }
        }
    );
    /**
     * @description To mix several vectors.
     * @param {Array<Vector>|Set<Vector>} vecArr The array/set that contains the vectors.
     * @returns {Vector} The result vector.
     */
    Vector.mix = function (vecArr) {
        var x = 0,
            y = 0;
        vecArr.forEach(function (v) {
            x += v.x;
            y += v.y;
        });
        return new Vector(x, y);
    };
    /**
     * @description To mix several vectors and an average vector.
     * @param {Array<Vector>|Set<Vector>} vecArr The array/set that contains the vectors.
     * @returns {Vector} The result vector.
     */
    Vector.avg = function (vecArr) {
        var len = vecArr.length,
            x = 0,
            y = 0;
        vecArr.forEach(function (v) {
            x += v.x;
            y += v.y;
        });
        x /= len;
        y /= len;
        return new Vector(x, y);
    };
    /**
     * @description To create a vector from two points. (p1->p2)
     * @param {{x:number,y:number}} p1 The first point.
     * @param {{x:number,y:number}} p2 The second point.
     * @returns {Vector} The result.
     */
    Vector.fromPoints = function (p1, p2) {
        return new Vector(p2.x - p1.x, p2.y - p1.y);
    };

    /**
     * @description The constructor of items.
     * @param {string} tag The tag of the item. (Any string except '*'.)
     * @param {Array<Vector>} vertices [Optional] The vertices of its outline.
     */
    var Item = World.Item = new Constructor(
        function (tag, vertices) {
            if (tag === '*') {
                throw new Error('Illegal tag!');
            }
            this.r = 100; // The general size of the item. This helps to improve the collision testing.
            this.active = false; // Whether the item is active. This can help improve the behavior.
            this.penetrative = false; // Whether the item can be penetrated.
            this.flex = .5; // Affects the collision behavior of the item.
            this.m = 5;
            this.g = 2;
            this.resistance = .2;
            this.maxV = 60;
            this.maxA = 60;
            this.tag = '' + tag;
            this.pos = new Vector();
            this.a = new Vector();
            this.v = new Vector();
            this.forces = new Set();
            this.outline = new Outline(vertices);
        }, {
            /**
             * @description To update the item.
             * @param {number} ratio The ratio.
             * @returns {Item} The item itself.
             */
            update: function (ratio) {
                if (this.active) {
                    var v = this.v,
                        a = this.a,
                        m = this.m,
                        force = Vector.mix(this.forces).scale(1 / m).add(0, this.g);
                    a.setVec(force);
                    var curA = a.getLen(),
                        maxA = this.maxA;
                    if (curA > maxA) {
                        a.scale(maxA / curA);
                    }
                    v.addVec(a.clone().scale(ratio));
                    var curV = v.getLen(),
                        maxV = this.maxV;
                    if (curV > maxV) {
                        v.scale(maxV / curV);
                    }
                    this.pos.addVec(v);
                    if (curV > 0) {
                        v.scale(1 - this.resistance);
                    }
                } else {
                    this.a.set(0, 0);
                    this.v.set(0, 0);
                }
                return this;
            },
            /**
             * @description To tell whether this item matches the tag.
             * @param {string} tag The tag to match.
             * @returns {boolean} The result.
             */
            matchTag: function (tag) {
                return this.tag === tag || tag === '*';
            },
            /**
             * @description To tell whether this item matches the tags.
             * @param {Set<string>} tags The set of the tags to match.
             * @returns {boolean} The result.
             */
            matchTags: function (tags) {
                return tags.has('*') || tags.has(this.tag);
            },
            /**
             * @description To check whether this item collides with that item.
             * @param {Item} thatItem That item.
             * @returns {Vector|boolean} The result. (See World.checkCollision.)
             */
            checkCollision: function (thatItem) {
                return checkCollision(this, thatItem);
            },
            /**
             * @description To get the real outline of the item.
             * @returns {Outline} The result.
             */
            getRealOutline: function () {
                return this.outline.clone().translateVec(this.pos);
            },
            /**
             * @description To draw the path of the outline of the item.
             * @param {CanvasRenderingContext2D} ctx The canvas context.
             * @returns {Item} The item itself.
             */
            path: function (ctx) {
                this.getRealOutline().path(ctx);
                return this;
            }
        }, [
            CollisionTarget,
            Agency
        ]
    );

    /**
     * @description The constructor of item groups. (Please note that a group should be added to a world by world.addGroup().)
     * @param {Item[]} items [Optional] The items.
     */
    var Group = World.Group = new Constructor(
        function (items) {
            this.items = new Set(items || []);
        }, {
            /**
             * @description To move the items togother.
             * @param {number} x The delta x.
             * @param {number} y The delta y.
             * @returns {Group} The group itself.
             */
            move: function (x, y) {
                this.items.forEach(function (item) {
                    item.pos.add(x, y);
                });
                return this;
            },
            /**
             * @description To move the items togother by giving a vector.
             * @param {Vector} v The moving vector.
             * @returns {Group} The group itself.
             */
            moveVec: function (v) {
                this.items.forEach(function (item) {
                    item.pos.addVec(v);
                });
                return this;
            }
        }
    );

    return World;

});