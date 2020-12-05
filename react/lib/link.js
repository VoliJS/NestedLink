import * as tslib_1 from "tslib";
/**
 * Advanced React links for purely functional two-way data binding
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
import { helpers, arrayHelpers } from './helpers';
export { StateRef as Link };
// Main Link class. All links must extend it.
var StateRef = /** @class */ (function () {
    function StateRef(value) {
        this.value = value;
    }
    // Create custom link to arbitrary value
    StateRef.value = function (value, set) {
        return new CustomStateRef(value, set);
    };
    /**
    * Unwrap object with links, returning an object of a similar shape filled with link values.
    */
    StateRef.getValues = function (links) {
        return unwrap(links, 'value');
    };
    Object.defineProperty(StateRef.prototype, "current", {
        // EXPERIMENTAL: Support useRef interface.
        get: function () { return this.value; },
        set: function (x) { this.set(x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateRef.prototype, "_changeToken", {
        // Private accessor for whenChanged. Uniform with Type-R models and collections API.
        get: function () {
            return this.value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Unwrap object with links, returning an object of a similar shape filled with link errors.
     */
    StateRef.getErrors = function (links) {
        return unwrap(links, 'error');
    };
    /**
     * Return true if an object with links contains any errors.
     */
    StateRef.hasErrors = function (links) {
        for (var key in links) {
            if (links.hasOwnProperty(key) && links[key].error) {
                return true;
            }
        }
        return false;
    };
    /**
    * Assing links with values from the source object.
    */
    StateRef.setValues = function (links, source) {
        if (source) {
            for (var key in links) {
                var sourceKey = trim(key);
                if (source.hasOwnProperty(sourceKey)) {
                    var sourceVal = source[sourceKey];
                    sourceVal === void 0 || links[key].set(sourceVal);
                }
            }
        }
    };
    StateRef.prototype.onChange = function (handler) {
        var _this = this;
        return new ClonedStateRef(this, function (x) {
            handler(x);
            _this.set(x);
        });
    };
    Object.defineProperty(StateRef.prototype, "props", {
        // <input { ...link.props } />
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
    // Immediately update the link value using given transform function.
    StateRef.prototype.update = function (transform, e) {
        var next = transform(this.clone(), e);
        next === void 0 || this.set(next);
    };
    // Create new link which applies transform function on set.
    StateRef.prototype.pipe = function (handler) {
        var _this = this;
        return new ClonedStateRef(this, function (x) {
            var next = handler(x, _this.value);
            next === void 0 || _this.set(next);
        });
    };
    // Create UI event handler function which will update the link with a given transform function.
    StateRef.prototype.action = function (transform) {
        var _this = this;
        return function (e) { return _this.update(transform, e); };
    };
    StateRef.prototype.equals = function (truthyValue) {
        return new EqualsRef(this, truthyValue);
    };
    StateRef.prototype.enabled = function (defaultValue) {
        return new EnabledRef(this, defaultValue || "");
    };
    // Array-only links methods
    StateRef.prototype.contains = function (element) {
        return new ContainsRef(this, element);
    };
    StateRef.prototype.push = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.push.apply(array, arguments);
        this.set(array);
    };
    StateRef.prototype.unshift = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.unshift.apply(array, arguments);
        this.set(array);
    };
    StateRef.prototype.splice = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.splice.apply(array, arguments);
        this.set(array);
    };
    StateRef.prototype.map = function (iterator) {
        return helpers(this.value).map(this, iterator);
    };
    StateRef.prototype.removeAt = function (key) {
        var value = this.value, _ = helpers(value);
        this.set(_.remove(_.clone(value), key));
    };
    StateRef.prototype.at = function (key) {
        return new RefAt(this, key);
    };
    StateRef.prototype.clone = function () {
        var value = this.value;
        return helpers(value).clone(value);
    };
    StateRef.prototype.pick = function () {
        var links = {}, keys = arguments.length ? arguments : Object.keys(this.value);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            links[key] = new RefAt(this, key);
        }
        return links;
    };
    /**
     * Convert link to object to the object of links with $-keys.
     */
    StateRef.prototype.$links = function () {
        var links = {}, value = this.value;
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                links['$' + key] = new RefAt(this, key);
            }
        }
        return links;
    };
    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    StateRef.prototype.check = function (whenValid, error) {
        if (!this.error && !whenValid(this.value)) {
            this.error = error || whenValid.error || defaultError;
        }
        return this;
    };
    return StateRef;
}());
export { StateRef };
var CustomStateRef = /** @class */ (function (_super) {
    tslib_1.__extends(CustomStateRef, _super);
    function CustomStateRef(value, set) {
        var _this = _super.call(this, value) || this;
        _this.set = set;
        return _this;
    }
    CustomStateRef.prototype.set = function (x) { };
    return CustomStateRef;
}(StateRef));
export { CustomStateRef };
var ClonedStateRef = /** @class */ (function (_super) {
    tslib_1.__extends(ClonedStateRef, _super);
    function ClonedStateRef(parent, set) {
        var _this = _super.call(this, parent.value) || this;
        _this.set = set;
        var error = parent.error;
        if (error)
            _this.error = error;
        return _this;
    }
    ClonedStateRef.prototype.set = function (x) { };
    return ClonedStateRef;
}(StateRef));
export { ClonedStateRef };
var EqualsRef = /** @class */ (function (_super) {
    tslib_1.__extends(EqualsRef, _super);
    function EqualsRef(parent, truthyValue) {
        var _this = _super.call(this, parent.value === truthyValue) || this;
        _this.parent = parent;
        _this.truthyValue = truthyValue;
        return _this;
    }
    EqualsRef.prototype.set = function (x) {
        this.parent.set(x ? this.truthyValue : null);
    };
    return EqualsRef;
}(StateRef));
export { EqualsRef };
var EnabledRef = /** @class */ (function (_super) {
    tslib_1.__extends(EnabledRef, _super);
    function EnabledRef(parent, defaultValue) {
        var _this = _super.call(this, parent.value != null) || this;
        _this.parent = parent;
        _this.defaultValue = defaultValue;
        return _this;
    }
    EnabledRef.prototype.set = function (x) {
        this.parent.set(x ? this.defaultValue : null);
    };
    return EnabledRef;
}(StateRef));
export { EnabledRef };
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
}(StateRef));
export { ContainsRef };
var defaultError = 'Invalid value';
/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 */
var RefAt = /** @class */ (function (_super) {
    tslib_1.__extends(RefAt, _super);
    function RefAt(parent, key) {
        var _this = _super.call(this, parent.value[key]) || this;
        _this.parent = parent;
        _this.key = key;
        return _this;
    }
    RefAt.prototype.remove = function () {
        this.parent.removeAt(this.key);
    };
    // Set new element value to parent array or object, performing purely functional update.
    RefAt.prototype.set = function (x) {
        var _this = this;
        if (this.value !== x) {
            this.parent.update(function (value) {
                value[_this.key] = x;
                return value;
            });
        }
    };
    ;
    return RefAt;
}(StateRef));
export { RefAt };
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
//# sourceMappingURL=link.js.map