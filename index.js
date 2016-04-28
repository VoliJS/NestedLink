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
var Link = (function () {
    function Link(value) {
        this.value = value;
    }
    Object.defineProperty(Link.prototype, "validationError", {
        get: function () { return this.error; },
        enumerable: true,
        configurable: true
    });
    // Link set functions
    Link.prototype.set = function (x) { };
    // DEPRECATED: Old React method for backward compatibility
    Link.prototype.requestChange = function (x) {
        this.set(x);
    };
    // Create link to componen't state
    Link.state = function (component, key) {
        return new StateLink(component, key);
    };
    ;
    Link.custom = function (value, set) {
        return new CustomLink(value, set);
    };
    // DEPRECATED: Old valueLink method for backward compatibility
    Link.prototype.toggle = function () { this.set(!this.value); };
    Link.prototype.contains = function (element) {
        return new ContainsLink(this, element);
    };
    // Immediately update the link value using given transform function.
    Link.prototype.update = function (transform, e) {
        var prev = this.value;
        prev = helpers(prev).clone(prev);
        var next = transform(prev, e);
        next === void 0 || this.set(next);
    };
    // Create UI event handler function which will update the link with a given transform function.
    Link.prototype.action = function (transform) {
        var _this = this;
        return function (e) { return _this.update(transform, e); };
    };
    Link.prototype.equals = function (truthyValue) {
        return new EqualsLink(this, truthyValue);
    };
    Link.prototype.at = function (key) {
        return new ChainedLink(this, key);
    };
    Link.prototype.map = function (iterator) {
        return helpers(this.value).map(this, iterator);
    };
    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    Link.prototype.check = function (whenValid, error) {
        if (!this.error && !whenValid(this.value)) {
            this.error = error || defaultError;
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
    return CustomLink;
}(Link));
exports.CustomLink = CustomLink;
var StateLink = (function (_super) {
    __extends(StateLink, _super);
    function StateLink(component, key) {
        _super.call(this, component.state[key]);
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
function helpers(value) {
    switch (value && Object.getPrototypeOf(value)) {
        case Array.prototype:
            return arrayHelpers;
        case Object.prototype:
            return objectHelpers;
        default:
            return dummyHelpers;
    }
}
// Do nothing for types other than Array and plain Object.
var dummyHelpers = {
    clone: function (value) { return value; },
    map: function (link, fun) { return []; }
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
//# sourceMappingURL=index.js.map