import * as tslib_1 from "tslib";
/**
 * Advanced React links for purely functional two-way data binding
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
import { arrayHelpers, helpers } from './helpers';
export * from './helpers';
// Main Link class. All links must extend it.
var ValueLink = /** @class */ (function () {
    function ValueLink(value) {
        this.value = value;
    }
    // Create custom link to arbitrary value
    ValueLink.value = function (value, set) {
        return new CustomValueLink(value, set);
    };
    /**
    * Unwrap object with links, returning an object of a similar shape filled with link values.
    */
    ValueLink.getValues = function (links) {
        return unwrap(links, 'value');
    };
    Object.defineProperty(ValueLink.prototype, "current", {
        // EXPERIMENTAL: Support useRef interface.
        get: function () { return this.value; },
        set: function (x) { this.set(x); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueLink.prototype, "_changeToken", {
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
    ValueLink.getErrors = function (links) {
        return unwrap(links, 'error');
    };
    /**
     * Return true if an object with links contains any errors.
     */
    ValueLink.hasErrors = function (links) {
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
    ValueLink.setValues = function (links, source) {
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
    ValueLink.prototype.onChange = function (handler) {
        var _this = this;
        return new ClonedValueLink(this, function (x) {
            handler(x);
            _this.set(x);
        });
    };
    Object.defineProperty(ValueLink.prototype, "props", {
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
    ValueLink.prototype.update = function (transform, e) {
        var next = transform(this.clone(), e);
        next === void 0 || this.set(next);
    };
    // Create new link which applies transform function on set.
    ValueLink.prototype.pipe = function (handler) {
        var _this = this;
        return new ClonedValueLink(this, function (x) {
            var next = handler(x, _this.value);
            next === void 0 || _this.set(next);
        });
    };
    // Create UI event handler function which will update the link with a given transform function.
    ValueLink.prototype.action = function (transform) {
        var _this = this;
        return function (e) { return _this.update(transform, e); };
    };
    ValueLink.prototype.equals = function (truthyValue) {
        return new EqualsValueLink(this, truthyValue);
    };
    ValueLink.prototype.enabled = function (defaultValue) {
        return new EnabledValueLink(this, defaultValue || "");
    };
    // Array-only links methods
    ValueLink.prototype.contains = function (element) {
        return new ContainsRef(this, element);
    };
    ValueLink.prototype.push = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.push.apply(array, arguments);
        this.set(array);
    };
    ValueLink.prototype.unshift = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.unshift.apply(array, arguments);
        this.set(array);
    };
    ValueLink.prototype.splice = function () {
        var array = arrayHelpers.clone(this.value);
        Array.prototype.splice.apply(array, arguments);
        this.set(array);
    };
    ValueLink.prototype.map = function (iterator) {
        return helpers(this.value).map(this, iterator);
    };
    ValueLink.prototype.removeAt = function (key) {
        var value = this.value, _ = helpers(value);
        this.set(_.remove(_.clone(value), key));
    };
    ValueLink.prototype.at = function (key) {
        return new PropValueLink(this, key);
    };
    ValueLink.prototype.clone = function () {
        var value = this.value;
        return helpers(value).clone(value);
    };
    ValueLink.prototype.pick = function () {
        var links = {}, keys = arguments.length ? arguments : Object.keys(this.value);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            links[key] = new PropValueLink(this, key);
        }
        return links;
    };
    /**
     * Convert link to object to the object of links with $-keys.
     */
    ValueLink.prototype.$links = function () {
        var links = {}, value = this.value;
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                links['$' + key] = new PropValueLink(this, key);
            }
        }
        return links;
    };
    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    ValueLink.prototype.check = function (whenValid, error) {
        if (!this.error && !whenValid(this.value)) {
            this.error = error || whenValid.error || defaultError;
        }
        return this;
    };
    return ValueLink;
}());
export { ValueLink };
var CustomValueLink = /** @class */ (function (_super) {
    tslib_1.__extends(CustomValueLink, _super);
    function CustomValueLink(value, set) {
        var _this = _super.call(this, value) || this;
        _this.set = set;
        return _this;
    }
    CustomValueLink.prototype.set = function (x) { };
    return CustomValueLink;
}(ValueLink));
export { CustomValueLink };
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
}(ValueLink));
export { ClonedValueLink };
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
}(ValueLink));
export { EqualsValueLink };
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
}(ValueLink));
export { EnabledValueLink };
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
}(ValueLink));
export { ContainsRef };
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
    // Set new element value to parent array or object, performing purely functional update.
    PropValueLink.prototype.set = function (x) {
        var _this = this;
        if (this.value !== x) {
            this.parent.update(function (value) {
                value[_this.key] = x;
                return value;
            });
        }
    };
    ;
    return PropValueLink;
}(ValueLink));
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