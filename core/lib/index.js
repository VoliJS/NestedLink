/**
 * Purely functional two-way data binding library for React
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
import { arrayHelpers, helpers } from './helpers';
export * from './helpers';
/**
 * The `PurePtr` class is an abstract, purely functional pointer that encapsulates a value, a function to update the value, and its validation error.
 * The enclosed value is considered immutable.
 */
export class PurePtr {
    constructor(value) {
        this.value = value;
        /** Validation error. Usually a string containing the error message, but can hold any type. */
        this.error = void 0;
    }
    // Private accessor for whenChanged. Uniform with Type-R models and collections API.
    get _changeToken() {
        return this.value;
    }
    /** Creates a new pointer that executes the given function before updating the link's value. */
    onChange(handler) {
        return new ClonedPtr(this, (x) => {
            handler(x);
            this.set(x);
        });
    }
    /** Produces a new pointer that transforms the value before calling `set`. */
    pipe(handler) {
        return new ClonedPtr(this, x => {
            const next = handler(x, this.value);
            next === void 0 || this.set(next);
        });
    }
    /**
     * Creates React component props for the <input> component.
     *
     * <input { ...link.props } />
     */
    get props() {
        return typeof this.value === 'boolean' ? {
            checked: this.value,
            onChange: e => this.set(Boolean(e.target.checked))
        } : {
            value: this.value,
            onChange: (e) => this.set(e.target.value)
        };
    }
    /** Updates the value using the given transform function. */
    update(transform) {
        const next = transform(this.value);
        next === void 0 || this.set(next);
    }
    equals(truthyValue) {
        return new ValueEqualsPtr(this, truthyValue);
    }
    get isTruthy() {
        return this.value ? true : undefined;
    }
    enabled(defaultValue) {
        return new EnabledValuePtr(this, defaultValue || "");
    }
    // Array-only methods
    contains(element) {
        return new ArrayContainsPtr(this, element);
    }
    push() {
        const array = arrayHelpers.clone(this.value);
        Array.prototype.push.apply(array, arguments);
        this.set(array);
    }
    unshift() {
        const array = arrayHelpers.clone(this.value);
        Array.prototype.unshift.apply(array, arguments);
        this.set(array);
    }
    splice() {
        const array = arrayHelpers.clone(this.value);
        Array.prototype.splice.apply(array, arguments);
        this.set(array);
    }
    map(iterator) {
        return helpers(this.value).map(this, iterator);
    }
    removeAt(key) {
        const { value } = this, _ = helpers(value);
        this.set(_.remove(_.clone(value), key));
    }
    at(key) {
        return new ObjPropPtr(this, key);
    }
    find(predicate) {
        const idx = this.value.findIndex(predicate);
        return idx >= 0 ? this.at(idx) : undefined;
    }
    remove(predicate) {
        this.update(array => array.filter((el, idx) => !predicate(el, idx)));
    }
    removeSelf() {
        this.set(undefined);
    }
    filter(predicate) {
        const result = [];
        for (let i = 0; i < this.value.length; i++) {
            if (predicate(this.value[i], i)) {
                result.push(this.at(i));
            }
        }
        return result;
    }
    clone() {
        let { value } = this;
        return helpers(value).clone(value);
    }
    pick() {
        let links = Array(arguments.length);
        for (let i = 0; i < arguments.length; i++) {
            links[i] = new ObjPropPtr(this, arguments[i]);
        }
        return links;
    }
    /**
     * Validate pointer with predicate. Can be chained.
     */
    check(whenValid, error) {
        if (!this.error && !whenValid(this.value)) {
            this.error = error || whenValid.error || defaultError;
        }
        return this;
    }
}
(function (PurePtr) {
    /** Create pointer out of its value and the set function */
    function value(value, set) {
        return new CustomPtr(value, set);
    }
    PurePtr.value = value;
    function mutable(state) {
        return new CustomPtr(state, x => {
            for (let key in x) {
                if (x.hasOwnProperty(key)) {
                    state[key] = x[key];
                }
            }
        });
    }
    PurePtr.mutable = mutable;
})(PurePtr || (PurePtr = {}));
class CustomPtr extends PurePtr {
    set(x) { }
    constructor(value, set) {
        super(value);
        this.set = set;
    }
}
class ClonedPtr extends PurePtr {
    set(x) { }
    constructor(parent, set) {
        super(parent.value);
        this.set = set;
        const { error } = parent;
        if (error)
            this.error = error;
    }
}
class ValueEqualsPtr extends PurePtr {
    constructor(parent, truthyValue) {
        super(parent.value === truthyValue);
        this.parent = parent;
        this.truthyValue = truthyValue;
    }
    set(x) {
        this.parent.set(x ? this.truthyValue : null);
    }
}
class EnabledValuePtr extends PurePtr {
    constructor(parent, defaultValue) {
        super(parent.value != null);
        this.parent = parent;
        this.defaultValue = defaultValue;
    }
    set(x) {
        this.parent.set(x ? this.defaultValue : null);
    }
}
class ArrayContainsPtr extends PurePtr {
    constructor(parent, element) {
        super(parent.value.indexOf(element) >= 0);
        this.parent = parent;
        this.element = element;
    }
    set(x) {
        var next = Boolean(x);
        if (this.value !== next) {
            var arr = this.parent.value, nextValue = x ? arr.concat(this.element) : arr.filter(el => el !== this.element);
            this.parent.set(nextValue);
        }
    }
}
const defaultError = 'Invalid value';
/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 */
export class ObjPropPtr extends PurePtr {
    constructor(parent, key) {
        super(parent.value[key]);
        this.parent = parent;
        this.key = key;
    }
    removeSelf() {
        this.parent.removeAt(this.key);
    }
    update(transform) {
        const { key } = this;
        this.parent.update(obj => {
            const prev = obj[key], next = transform(helpers(prev).clone(prev));
            if (next !== void 0) {
                const res = helpers(obj).clone(obj);
                res[key] = next;
                return res;
            }
        });
    }
    // Set new element value to parent array or object, performing purely functional update.
    set(next) {
        const { key } = this;
        this.parent.update(obj => {
            if (obj[key] !== next) {
                const res = helpers(obj).clone(obj);
                res[key] = next;
                return res;
            }
        });
    }
    ;
}
