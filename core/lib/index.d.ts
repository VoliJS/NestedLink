export * from './helpers';
type ArrayType<T> = ArrayElement<T>[];
type ArrayElement<T> = T extends (infer E)[] ? E : never;
type RecordElement<T> = T extends {
    [key: string]: infer E;
} ? E : never;
type RecordType<T> = {
    [key: string]: RecordElement<T>;
};
/**
 * An abstract class representing a pointer to a value of type `T`.
 * Provides various methods for manipulating and interacting with the value.
 *
 * @template T - The type of the value.
 */
export declare abstract class PurePtr<T> {
    value: T;
    /** Validation error. Usually a string containing the error message, but can hold any type. */
    error: any;
    /** Set value */
    abstract set(x: T): void;
    constructor(value: T);
    protected get _changeToken(): T;
    /**
     * Registers a handler function to be called when the value changes.
     * The handler function will be invoked with the new value, and the value will be updated.
     *
     * @param handler - A function that takes the new value of type `T` as an argument.
     * @returns A new instance of `ClonedPtr` that wraps the current instance and the handler function.
     */
    onChange(handler: (x: T) => void): PurePtr<T>;
    /**
     * Applies a handler function to the new value and the previous value
     * to transform the value before updating it.
     *
     * @param handler - A function that takes the next value and the previous value,
     * and returns a new value.
     * @returns A new `PurePtr` instance with the result of the handler function.
     */
    pipe(handler: (next: T, prev: T) => T): PurePtr<T>;
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
    get props(): T extends boolean ? {
        checked: boolean;
        onChange: (e: any) => void;
    } : {
        value: T;
        onChange: (e: any) => void;
    };
    /**
     * Updates the ptr value using the provided transformation function.
     *
     * @param transform - A function that takes the current value and returns a new value.
     *                    If the function returns `undefined`, the value is not updated.
     */
    update(transform: PurePtr.Transform<T>): void;
    /**
     * Compares the current value with the provided `truthyValue` and returns a boolean `PurePtr` instance
     * that indicates whether the values are equal.
     *
     * @param truthyValue - The value to compare with the current value.
     * @returns A `PurePtr<boolean>` instance that represents the result of the comparison.
     */
    equals(truthyValue: T): PurePtr<boolean>;
    /**
     * Property to determine if the value is truthy.
     *
     * @returns {boolean | undefined} - Returns `true` if the value is truthy, otherwise `undefined`.
     */
    get isTruthy(): boolean | undefined;
    enabled(defaultValue?: T): PurePtr<boolean>;
    /**
     * Returns a boolean `PurePtr` instance that indicates whether the element is contained within the array.
     *
     * @param this - A pointer to the array to be checked.
     * @param element - The element to search for within the array.
     * @returns A pointer to a boolean indicating whether the element is contained within the array.
     */
    contains(this: PurePtr<ArrayType<T>>, element: ArrayElement<T>): PurePtr<boolean>;
    push(this: PurePtr<ArrayType<T>>, ...args: ArrayType<T>): void;
    unshift(this: PurePtr<ArrayType<T>>, ...args: ArrayType<T>): void;
    splice(this: PurePtr<ArrayType<T>>, start: number, deleteCount?: number): void;
    map<Z>(this: PurePtr<ArrayType<T>>, iterator: (link: ObjPropPtr<ArrayElement<T>, number>, idx: number) => Z): Z[];
    map<Z>(this: PurePtr<RecordType<T>>, iterator: (link: ObjPropPtr<RecordElement<T>, string>, idx: string) => Z): Z[];
    removeAt(this: PurePtr<ArrayType<T>>, key: number): void;
    removeAt(key: keyof T): void;
    at(this: PurePtr<ArrayType<T>>, key: number): ObjPropPtr<ArrayElement<T>, number>;
    at<K extends keyof T, E extends T[K]>(key: K): ObjPropPtr<E, K>;
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
    find(this: PurePtr<ArrayType<T>>, predicate: (element: ArrayElement<T>, idx: number) => boolean): PurePtr<ArrayElement<T>> | undefined;
    /**
     * Removes elements from the array that match the given predicate.
     *
     * @param this - The array from which elements will be removed.
     * @param predicate - A function that tests each element of the array.
     * If the predicate returns `true`, the element is removed.
     * @returns void
     */
    remove(this: PurePtr<ArrayType<T>>, predicate: (element: ArrayElement<T>, idx: number) => boolean): void;
    /**
     * Removes the element from the array or object.
     */
    removeSelf(): void;
    /**
     * Filters the elements of the array based on the provided predicate function, and returns an array of pointers to the filtered elements.
     *
     * @param predicate - A function that tests each element of the array.
     * It should return `true` to keep the element, or `false` otherwise.
     * It receives the current element and its index as arguments.
     * @returns An array of `PurePtr` elements that satisfy the predicate function.
     */
    filter(this: PurePtr<ArrayType<T>>, predicate: (element: ArrayElement<T>, idx: number) => boolean): PurePtr<ArrayElement<T>>[];
    /**
     * Creates and returns a clone of the current object.
     *
     * @returns {T} A new instance of the object with the same value.
     */
    clone(): T;
    pick<K extends (keyof T)[]>(...keys: K): {
        [I in keyof K]: ObjPropPtr<T[K[I]], K[I]>;
    };
    /**
     * Validates the current value using the provided validator function.
     * If the value is invalid and no previous error exists, sets the error.
     *
     * @param whenValid - A function that takes the current value and returns a boolean indicating if the value is valid.
     * @param error - An optional error to set if the value is invalid. If not provided, the error from the validator or a default error will be used.
     * @returns The current instance for chaining.
     */
    check(whenValid: PurePtr.Validator<T>, error?: any): this;
}
export declare namespace PurePtr {
    interface Validator<T> {
        (value: T): boolean;
        error?: any;
    }
    type Transform<T> = (value: T) => T | undefined;
    type Hash<T extends object = any> = {
        [K in keyof T]: PurePtr<T[K]>;
    };
    /**
     * Creates a new `PurePtr` instance with the given value and setter function.
     *
     * @template T - The type of the value.
     * @param {T} value - The initial value to be stored in the `PurePtr`.
     * @param {(x: T) => void} set - A function to set the value.
     * @returns {PurePtr<T>} A new `PurePtr` instance containing the value and setter function.
     */
    function value<T>(value: T, set: (x: T) => void): PurePtr<T>;
    function mutable<T extends object>(state: T): PurePtr<T>;
    /**
     * Checks if any of the provided pointers have errors.
     *
     * @param ptrs - An array of pointers to check for errors.
     * @returns `true` if any pointer has an error, otherwise `false`.
     */
    function haveErrors(...ptrs: PurePtr<any>[]): boolean;
}
/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 */
export declare class ObjPropPtr<E, K> extends PurePtr<E> {
    private parent;
    key: K;
    constructor(parent: PurePtr<any>, key: K);
    removeSelf(): void;
    update(transform: PurePtr.Transform<E>): void;
    set(next: E): void;
}
//# sourceMappingURL=index.d.ts.map