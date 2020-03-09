import * as tslib_1 from "tslib";
/**
 * Advanced React links for purely functional two-way data binding
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
import { arrayHelpers, helpers } from './helpers';
export * from './helpers';
/**
 * `Linked` class is an abstract linked value - the value, the function to update this value, and its validation error.
 * The enclosed value is considered as immutable.
 */
var Linked = /** @class */ (function () {
    function Linked(value) {
        this.value = value;
        /** Validation error. Usually is a string with error text, but can hold any type. */
        this.error = void 0;
    }
    Object.defineProperty(Linked.prototype, "current", {
        /** EXPERIMENTAL: Support useRef interface. */
        get: function () { return this.value; },
        set: function (x) { this.set(x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Linked.prototype, "_changeToken", {
        // Private accessor for whenChanged. Uniform with Type-R models and collections API.
        get: function () {
            return this.value;
        },
        enumerable: true,
        configurable: true
    });
    /** Produce the new link executing the given function before the link value will be updated. */
    Linked.prototype.onChange = function (handler) {
        var _this = this;
        return new ClonedValueLink(this, function (x) {
            handler(x);
            _this.set(x);
        });
    };
    /** Produce the new link which transform the value before `set` with a given function. */
    Linked.prototype.pipe = function (handler) {
        var _this = this;
        return new ClonedValueLink(this, function (x) {
            var next = handler(x, _this.value);
            next === void 0 || _this.set(next);
        });
    };
    Object.defineProperty(Linked.prototype, "props", {
        /**
         * Create React component props for the <input> component.
         *
         * <input { ...link.props } />
         */
        get: function () {
            var _this = this;
            return typeof this.value === 'boolean' ? {
                checked: this.value,
                onChange: function (e) { return _this.set(Boolean(e.target.checked)); }
            } : {
                value: this.value,
                onChange: function (e) { return _this.set(e.target.value); }
            };
        },
        enumerable: true,
        configurable: true
    });
    /** Update the linked value using given transform function. */
    Linked.prototype.update = function (transform, e) {
        var next = transform(this.clone(), e);
        next === void 0 || this.set(next);
    };
    // Create UI event handler function which will update the link with a given transform function.
    Linked.prototype.action = function (transform) {
        var _this = this;
        return function (e) { return _this.update(transform, e); };
    };
    Linked.prototype.equals = function (truthyValue) {
        return new EqualsValueLink(this, truthyValue);
    };
    Linked.prototype.enabled = function (defaultValue) {
        return new EnabledValueLink(this, defaultValue || "");
    };
    // Array-only links methods
    Linked.prototype.contains = function (element) {
        return new ContainsRef(this, element);
    };
    Linked.prototype.push = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.push.apply(array, arguments);
        this.set(array);
    };
    Linked.prototype.unshift = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.unshift.apply(array, arguments);
        this.set(array);
    };
    Linked.prototype.splice = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.splice.apply(array, arguments);
        this.set(array);
    };
    Linked.prototype.map = function (iterator) {
        return helpers(this.value).map(this, iterator);
    };
    Linked.prototype.removeAt = function (key) {
        var value = this.value, _ = helpers(value);
        this.set(_.remove(_.clone(value), key));
    };
    Linked.prototype.at = function (key) {
        return new PropValueLink(this, key);
    };
    Linked.prototype.clone = function () {
        var value = this.value;
        return helpers(value).clone(value);
    };
    Linked.prototype.pick = function () {
        var links = {}, keys = arguments.length ? arguments : Object.keys(this.value);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            links[key] = new PropValueLink(this, key);
        }
        return links;
    };
    Object.defineProperty(Linked.prototype, "$", {
        /**
         * Convert link to object to the object of links.
         * Memorises the result, subsequent calls are cheap.
         */
        get: function () {
            if (!this._value$) {
                var links = this._value$ = {}, value = this.value;
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        links[key] = new PropValueLink(this, key);
                    }
                }
            }
            return this._value$;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    Linked.prototype.check = function (whenValid, error) {
        if (!this.error && !whenValid(this.value)) {
            this.error = error || whenValid.error || defaultError;
        }
        return this;
    };
    return Linked;
}());
export { Linked };
(function (Linked) {
    /** Create linked value out of its value and the set function */
    function value(value, set) {
        return new CustomValueLink(value, set);
    }
    Linked.value = value;
    function mutable(state) {
        return new CustomValueLink(state, function (x) {
            for (var key in x) {
                if (x.hasOwnProperty(key)) {
                    state[key] = x[key];
                }
            }
        });
    }
    Linked.mutable = mutable;
    /**
    * Unwrap object with links, returning an object of a similar shape filled with link values.
    */
    function getValues(links) {
        return unwrap(links, 'value');
    }
    Linked.getValues = getValues;
    /**
     * Unwrap object with links, returning an object of a similar shape filled with link errors.
     */
    function getErrors(links) {
        return unwrap(links, 'error');
    }
    Linked.getErrors = getErrors;
    /**
     * Return true if an object with links contains any errors.
     */
    function hasErrors(links) {
        for (var key in links) {
            if (links.hasOwnProperty(key) && links[key].error) {
                return true;
            }
        }
        return false;
    }
    Linked.hasErrors = hasErrors;
    /**
    * Assing links with values from the source object.
    */
    function setValues(links, source) {
        if (source) {
            for (var key in links) {
                var sourceKey = trim(key);
                if (source.hasOwnProperty(sourceKey)) {
                    var sourceVal = source[sourceKey];
                    sourceVal === void 0 || links[key].set(sourceVal);
                }
            }
        }
    }
    Linked.setValues = setValues;
})(Linked || (Linked = {}));
var CustomValueLink = /** @class */ (function (_super) {
    tslib_1.__extends(CustomValueLink, _super);
    function CustomValueLink(value, set) {
        var _this = _super.call(this, value) || this;
        _this.set = set;
        return _this;
    }
    CustomValueLink.prototype.set = function (x) { };
    return CustomValueLink;
}(Linked));
var ClonedValueLink = /** @class */ (function (_super) {
    tslib_1.__extends(ClonedValueLink, _super);
    function ClonedValueLink(parent, set) {
        var _this = _super.call(this, parent.value) || this;
        _this.set = set;
        var error = parent.error;
        if (error)
            _this.error = error;
        return _this;
    }
    ClonedValueLink.prototype.set = function (x) { };
    return ClonedValueLink;
}(Linked));
var EqualsValueLink = /** @class */ (function (_super) {
    tslib_1.__extends(EqualsValueLink, _super);
    function EqualsValueLink(parent, truthyValue) {
        var _this = _super.call(this, parent.value === truthyValue) || this;
        _this.parent = parent;
        _this.truthyValue = truthyValue;
        return _this;
    }
    EqualsValueLink.prototype.set = function (x) {
        this.parent.set(x ? this.truthyValue : null);
    };
    return EqualsValueLink;
}(Linked));
var EnabledValueLink = /** @class */ (function (_super) {
    tslib_1.__extends(EnabledValueLink, _super);
    function EnabledValueLink(parent, defaultValue) {
        var _this = _super.call(this, parent.value != null) || this;
        _this.parent = parent;
        _this.defaultValue = defaultValue;
        return _this;
    }
    EnabledValueLink.prototype.set = function (x) {
        this.parent.set(x ? this.defaultValue : null);
    };
    return EnabledValueLink;
}(Linked));
var ContainsRef = /** @class */ (function (_super) {
    tslib_1.__extends(ContainsRef, _super);
    function ContainsRef(parent, element) {
        var _this = _super.call(this, parent.value.indexOf(element) >= 0) || this;
        _this.parent = parent;
        _this.element = element;
        return _this;
    }
    ContainsRef.prototype.set = function (x) {
        var _this = this;
        var next = Boolean(x);
        if (this.value !== next) {
            var arr = this.parent.value, nextValue = x ? arr.concat(this.element) : arr.filter(function (el) { return el !== _this.element; });
            this.parent.set(nextValue);
        }
    };
    return ContainsRef;
}(Linked));
var defaultError = 'Invalid value';
/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 */
var PropValueLink = /** @class */ (function (_super) {
    tslib_1.__extends(PropValueLink, _super);
    function PropValueLink(parent, key) {
        var _this = _super.call(this, parent.value[key]) || this;
        _this.parent = parent;
        _this.key = key;
        return _this;
    }
    PropValueLink.prototype.remove = function () {
        this.parent.removeAt(this.key);
    };
    PropValueLink.prototype.update = function (transform, e) {
        var key = this.key;
        this.parent.update(function (obj) {
            var prev = obj[key], next = transform(helpers(prev).clone(prev), e);
            if (next !== void 0) {
                obj[key] = next;
                return obj;
            }
        });
    };
    // Set new element value to parent array or object, performing purely functional update.
    PropValueLink.prototype.set = function (next) {
        /*
        this.update( prev => {
            if( prev !== next ) return next
        })*/
        // A bit more efficient implementation.
        var key = this.key;
        this.parent.update(function (obj) {
            if (obj[key] !== next) {
                obj[key] = next;
                return obj;
            }
        });
    };
    ;
    return PropValueLink;
}(Linked));
export { PropValueLink };
function unwrap(links, field) {
    var values = {};
    for (var key in links) {
        if (links.hasOwnProperty(key)) {
            var value = links[key][field];
            if (value !== void 0) {
                values[trim(key)] = value;
            }
        }
    }
    return values;
}
function trim(key) {
    return key[0] === '$' ? key.slice(1) : key;
}
//# sourceMappingURL=index.js.map