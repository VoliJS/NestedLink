/**
 * Advanced React links for purely functional two-way data binding
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// Main Link class. All links must extend it.
var Link = (function () {
    // create 
    function Link(value) {
        this.value = value;
    }
    // Create link to componen't state
    Link.state = function (component, key) {
        var value = component.state[key], cache = component.links || (component.links = {}), cached = cache[key];
        return cached && cached.value === value ? cached : cache[key] = new StateLink(value, component, key);
    };
    ;
    // Ensure that listed links are cached. Return links cache.
    Link.all = function (component) {
        var state = component.state, links = component.links || (component.links = {});
        for (var i = 1; i < arguments.length; i++) {
            var key = arguments[i], value = state[key], cached = links[key];
            if (!cached || cached.value !== value) {
                links[key] = new StateLink(value, component, key);
            }
        }
        return links;
    };
    // Create custom link to arbitrary value
    Link.value = function (value, set) {
        return new CustomLink(value, set);
    };
    Object.defineProperty(Link.prototype, "validationError", {
        // DEPRECATED: Old error holder for backward compatibility with Volicon code base
        get: function () { return this.error; },
        enumerable: true,
        configurable: true
    });
    Link.prototype.onChange = function (handler) {
        var _this = this;
        return new CloneLink(this, function (x) {
            handler(x);
            _this.set(x);
        });
    };
    // DEPRECATED: Old React method for backward compatibility
    Link.prototype.requestChange = function (x) {
        this.set(x);
    };
    // Immediately update the link value using given transform function.
    Link.prototype.update = function (transform, e) {
        var next = transform(this.clone(), e);
        next === void 0 || this.set(next);
    };
    // Create new link which applies transform function on set.
    Link.prototype.pipe = function (handler) {
        var _this = this;
        return new CloneLink(this, function (x) {
            var next = handler(x);
            next === void 0 || _this.set(next);
        });
    };
    // Create UI event handler function which will update the link with a given transform function.
    Link.prototype.action = function (transform) {
        var _this = this;
        return function (e) { return _this.update(transform, e); };
    };
    Link.prototype.equals = function (truthyValue) {
        return new EqualsLink(this, truthyValue);
    };
    // Array-only links methods
    Link.prototype.contains = function (element) {
        return new ContainsLink(this, element);
    };
    Link.prototype.push = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.push.apply(array, arguments);
        this.set(array);
    };
    Link.prototype.unshift = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.unshift.apply(array, arguments);
        this.set(array);
    };
    Link.prototype.splice = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.splice.apply(array, arguments);
        this.set(array);
    };
    // Array and objects universal collection methods
    Link.prototype.map = function (iterator) {
        return helpers(this.value).map(this, iterator);
    };
    Link.prototype.remove = function (key) {
        var value = this.value, _ = helpers(value);
        this.set(_.remove(_.clone(value), key));
    };
    Link.prototype.at = function (key) {
        return new ChainedLink(this, key);
    };
    Link.prototype.clone = function () {
        var value = this.value;
        return helpers(value).clone(value);
    };
    Link.prototype.pick = function () {
        var links = {};
        for (var i = 0; i < arguments.length; i++) {
            var key = arguments[i];
            links[key] = new ChainedLink(this, key);
        }
        return links;
    };
    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    Link.prototype.check = function (whenValid, error) {
        if (!this.error && !whenValid(this.value)) {
            this.error = error || whenValid.error || defaultError;
        }
        return this;
    };
    return Link;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Link;
var CustomLink = (function (_super) {
    __extends(CustomLink, _super);
    function CustomLink(value, set) {
        _super.call(this, value);
        this.set = set;
    }
    CustomLink.prototype.set = function (x) { };
    return CustomLink;
}(Link));
exports.CustomLink = CustomLink;
var CloneLink = (function (_super) {
    __extends(CloneLink, _super);
    function CloneLink(parent, set) {
        _super.call(this, parent.value);
        this.set = set;
        var error = parent.error;
        if (error)
            this.error = error;
    }
    CloneLink.prototype.set = function (x) { };
    return CloneLink;
}(Link));
exports.CloneLink = CloneLink;
var StateLink = (function (_super) {
    __extends(StateLink, _super);
    function StateLink(value, component, key) {
        _super.call(this, value);
        this.component = component;
        this.key = key;
    }
    StateLink.prototype.set = function (x) {
        this.component.setState((_a = {}, _a[this.key] = x, _a));
        var _a;
    };
    return StateLink;
}(Link));
exports.StateLink = StateLink;
var EqualsLink = (function (_super) {
    __extends(EqualsLink, _super);
    function EqualsLink(parent, truthyValue) {
        _super.call(this, parent.value === truthyValue);
        this.parent = parent;
        this.truthyValue = truthyValue;
    }
    EqualsLink.prototype.set = function (x) {
        this.parent.set(x ? this.truthyValue : null);
    };
    return EqualsLink;
}(Link));
exports.EqualsLink = EqualsLink;
var ContainsLink = (function (_super) {
    __extends(ContainsLink, _super);
    function ContainsLink(parent, element) {
        _super.call(this, parent.value.indexOf(element) >= 0);
        this.parent = parent;
        this.element = element;
    }
    ContainsLink.prototype.set = function (x) {
        var _this = this;
        var next = Boolean(x);
        if (this.value !== next) {
            var arr = this.parent.value, nextValue = x ? arr.concat(this.element) : arr.filter(function (el) { return el !== _this.element; });
            this.parent.set(nextValue);
        }
    };
    return ContainsLink;
}(Link));
exports.ContainsLink = ContainsLink;
var defaultError = 'Invalid value';
/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 */
var ChainedLink = (function (_super) {
    __extends(ChainedLink, _super);
    function ChainedLink(parent, key) {
        _super.call(this, parent.value[key]);
        this.parent = parent;
        this.key = key;
    }
    ChainedLink.prototype.remove = function (key) {
        if (key === void 0) {
            this.parent.remove(this.key);
        }
        else {
            _super.prototype.remove.call(this, key);
        }
    };
    // Set new element value to parent array or object, performing purely functional update.
    ChainedLink.prototype.set = function (x) {
        var _this = this;
        if (this.value !== x) {
            this.parent.update(function (value) {
                value[_this.key] = x;
                return value;
            });
        }
    };
    ;
    return ChainedLink;
}(Link));
exports.ChainedLink = ChainedLink;
var ArrayProto = Array.prototype, ObjectProto = Object.prototype;
function helpers(value) {
    if (value && typeof value === 'object') {
        switch (Object.getPrototypeOf(value)) {
            case ArrayProto: return arrayHelpers;
            case ObjectProto: return objectHelpers;
        }
    }
    return dummyHelpers;
}
// Do nothing for types other than Array and plain Object.
var dummyHelpers = {
    clone: function (value) { return value; },
    map: function (link, fun) { return []; },
    remove: function (value) { return value; }
};
// `map` and `clone` for plain JS objects
var objectHelpers = {
    // Map through the link to object
    map: function (link, iterator) {
        var hash = link.value;
        var mapped = [];
        for (var key in hash) {
            var element = iterator(link.at(key), key);
            element === void 0 || (mapped.push(element));
        }
        return mapped;
    },
    remove: function (object, key) {
        delete object[key];
        return object;
    },
    // Shallow clone plain JS object
    clone: function (object) {
        var cloned = {};
        for (var key in object) {
            cloned[key] = object[key];
        }
        return cloned;
    }
};
// `map` and `clone` helpers for arrays.
var arrayHelpers = {
    // Shallow clone array
    clone: function (array) {
        return array.slice();
    },
    remove: function (array, i) {
        array.splice(i, 1);
        return array;
    },
    // Map through the link to array
    map: function (link, iterator) {
        var mapped = [], array = link.value;
        for (var i = 0; i < array.length; i++) {
            var y = iterator(link.at(i), i);
            y === void 0 || (mapped.push(y));
        }
        return mapped;
    }
};
//# sourceMappingURL=valuelink.js.map