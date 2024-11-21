/**
 * Purely functional two-way data binding library for React
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
import { arrayHelpers, helpers } from './helpers';
export * from './helpers';
/**
 * An abstract class representing a pointer to a value of type `T`.
 * Provides various methods for manipulating and interacting with the value.
 *
 * @template T - The type of the value.
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
    /**
     * Registers a handler function to be called when the value changes.
     * The handler function will be invoked with the new value, and the value will be updated.
     *
     * @param handler - A function that takes the new value of type `T` as an argument.
     * @returns A new instance of `ClonedPtr` that wraps the current instance and the handler function.
     */
    onChange(handler) {
        return new ClonedPtr(this, (x) => {
            handler(x);
            this.set(x);
        });
    }
    /**
     * Applies a handler function to the new value and the previous value
     * to transform the value before updating it.
     *
     * @param handler - A function that takes the next value and the previous value,
     * and returns a new value.
     * @returns A new `PurePtr` instance with the result of the handler function.
     */
    pipe(handler) {
        return new ClonedPtr(this, x => {
            const next = handler(x, this.value);
            next === void 0 || this.set(next);
        });
    }
    /**
     * Gets the properties for the React <input/> component based on the Ptr type.
     *
     * @returns An object containing either `checked` and `onChange` properties if the value is boolean,
     *          or `value` and `onChange` properties otherwise.
     *
     * - If `T` is boolean:
     *   - `checked`: A boolean indicating the checked state.
     *   - `onChange`: A function that handles the change event and updates the state.
     *
     * - If `T` is not boolean:
     *   - `value`: The current value of type `T`.
     *   - `onChange`: A function that handles the change event and updates the state.
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
    /**
     * Updates the ptr value using the provided transformation function.
     *
     * @param transform - A function that takes the current value and returns a new value.
     *                    If the function returns `undefined`, the value is not updated.
     */
    update(transform) {
        const next = transform(this.value);
        next === void 0 || this.set(next);
    }
    /**
     * Compares the current value with the provided `truthyValue` and returns a boolean `PurePtr` instance
     * that indicates whether the values are equal.
     *
     * @param truthyValue - The value to compare with the current value.
     * @returns A `PurePtr<boolean>` instance that represents the result of the comparison.
     */
    equals(truthyValue) {
        return new ValueEqualsPtr(this, truthyValue);
    }
    /**
     * Property to determine if the value is truthy.
     *
     * @returns {boolean | undefined} - Returns `true` if the value is truthy, otherwise `undefined`.
     */
    get isTruthy() {
        return this.value ? true : undefined;
    }
    enabled(defaultValue) {
        return new EnabledValuePtr(this, defaultValue || "");
    }
    /**
     * Returns a boolean `PurePtr` instance that indicates whether the element is contained within the array.
     *
     * @param this - A pointer to the array to be checked.
     * @param element - The element to search for within the array.
     * @returns A pointer to a boolean indicating whether the element is contained within the array.
     */
    contains(element) {
        return new ArrayContainsPtr(this, element);
    }
    /**
     * Pushes one or more elements to the end of the array and updates the value.
     *
     * This method clones the current array, pushes the provided arguments to the cloned array,
     * and then sets the updated array as the new value.
     *
     * @param {...any[]} arguments - The elements to add to the end of the array.
     */
    push() {
        const array = arrayHelpers.clone(this.value);
        Array.prototype.push.apply(array, arguments);
        this.set(array);
    }
    /**
     * Adds one or more elements to the beginning of the array and updates the value.
     *
     * This method clones the current array, applies the `unshift` operation to the clone,
     * and then sets the updated array as the new value.
     *
     * @param {...any[]} arguments - The elements to add to the beginning of the array.
     * @returns {void}
     */
    unshift() {
        const array = arrayHelpers.clone(this.value);
        Array.prototype.unshift.apply(array, arguments);
        this.set(array);
    }
    /**
     * Splices the array stored in `this.value`.
     *
     * This method clones the current array, applies the splice operation, and then updates the stored array with the result.
     * @returns {void} This method does not return a value.
     */
    splice() {
        const array = arrayHelpers.clone(this.value);
        Array.prototype.splice.apply(array, arguments);
        this.set(array);
    }
    /**
     * Creates a new array (or object) with the results of calling a provided function on every element.
     *
     * @param iterator - A function that is called for every element of the array. It takes a pointer to the element and its index.
     * @returns A new array with each element being the result of the iterator function.
     */
    map(iterator) {
        return helpers(this.value).map(this, iterator);
    }
    /**
     * Removes an element from the collection at the specified key.
     *
     * @param key - The key or index of the element to remove. Can be a number or a key of type T.
     */
    removeAt(key) {
        const { value } = this, _ = helpers(value);
        this.set(_.remove(_.clone(value), key));
    }
    /**
     * Retrieves a pointer to the element at the specified key.
     *
     * @param key - The key to access the property. It can be a number or a string.
     * @returns An instance of `ObjPropPtr` corresponding to the given key.
     */
    at(key) {
        return new ObjPropPtr(this, key);
    }
    /**
     * Finds a pointer to an element in the array that satisfies the provided predicate function.
     *
     * @param predicate - A function that tests each element of the array.
     * It should return `true` to keep the element, `false` otherwise.
     * It receives two arguments:
     *   - `element`: The current element being processed in the array.
     *   - `idx`: The index of the current element being processed in the array.
     * @returns A pointer to the found element, or `undefined` if no element satisfies the predicate.
     */
    find(predicate) {
        const idx = this.value.findIndex(predicate);
        return idx >= 0 ? this.at(idx) : undefined;
    }
    /**
     * Removes elements from the array that match the given predicate.
     *
     * @param this - The array from which elements will be removed.
     * @param predicate - A function that tests each element of the array.
     * If the predicate returns `true`, the element is removed.
     * @returns void
     */
    remove(predicate) {
        this.update(array => array.filter((el, idx) => !predicate(el, idx)));
    }
    /**
     * Removes the element from the array or object.
     */
    removeSelf() {
        this.set(undefined);
    }
    /**
     * Filters the elements of the array based on the provided predicate function, and returns an array of pointers to the filtered elements.
     *
     * @param predicate - A function that tests each element of the array.
     * It should return `true` to keep the element, or `false` otherwise.
     * It receives the current element and its index as arguments.
     * @returns An array of `PurePtr` elements that satisfy the predicate function.
     */
    filter(predicate) {
        const result = [];
        for (let i = 0; i < this.value.length; i++) {
            if (predicate(this.value[i], i)) {
                result.push(this.at(i));
            }
        }
        return result;
    }
    /**
     * Creates and returns a clone of the current object.
     *
     * @returns {T} A new instance of the object with the same value.
     */
    clone() {
        let { value } = this;
        return helpers(value).clone(value);
    }
    /**
     * Creates an array of pointers to the specified object properties.
     *
     * @returns An array of `ObjPropPtr` instances corresponding to the provided arguments.
     */
    pick() {
        let links = Array(arguments.length);
        for (let i = 0; i < arguments.length; i++) {
            links[i] = new ObjPropPtr(this, arguments[i]);
        }
        return links;
    }
    /**
     * Validates the current value using the provided validator function.
     * If the value is invalid and no previous error exists, sets the error.
     *
     * @param whenValid - A function that takes the current value and returns a boolean indicating if the value is valid.
     * @param error - An optional error to set if the value is invalid. If not provided, the error from the validator or a default error will be used.
     * @returns The current instance for chaining.
     */
    check(whenValid, error) {
        if (!this.error && !whenValid(this.value)) {
            this.error = error || whenValid.error || defaultError;
        }
        return this;
    }
}
(function (PurePtr) {
    /**
     * Creates a new `PurePtr` instance with the given value and setter function.
     *
     * @template T - The type of the value.
     * @param {T} value - The initial value to be stored in the `PurePtr`.
     * @param {(x: T) => void} set - A function to set the value.
     * @returns {PurePtr<T>} A new `PurePtr` instance containing the value and setter function.
     */
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
    /**
     * Checks if any of the provided pointers have errors.
     *
     * @param ptrs - An array of pointers to check for errors.
     * @returns `true` if any pointer has an error, otherwise `false`.
     */
    function haveErrors(...ptrs) {
        return ptrs.some(ptr => ptr.error !== void 0);
    }
    PurePtr.haveErrors = haveErrors;
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
