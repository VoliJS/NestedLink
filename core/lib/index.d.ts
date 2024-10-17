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
 * The `PurePtr` class is an abstract, purely functional pointer that encapsulates a value, a function to update the value, and its validation error.
 * The enclosed value is considered immutable.
 */
export declare abstract class PurePtr<T> {
    value: T;
    /** Validation error. Usually a string containing the error message, but can hold any type. */
    error: any;
    /** Set value */
    abstract set(x: T): void;
    constructor(value: T);
    protected get _changeToken(): T;
    /** Creates a new pointer that executes the given function before updating the link's value. */
    onChange(handler: (x: T) => void): PurePtr<T>;
    /** Produces a new pointer that transforms the value before calling `set`. */
    pipe(handler: (next: T, prev: T) => T): PurePtr<T>;
    /**
     * Creates React component props for the <input> component.
     *
     * <input { ...link.props } />
     */
    get props(): T extends boolean ? {
        checked: boolean;
        onChange: (e: any) => void;
    } : {
        value: T;
        onChange: (e: any) => void;
    };
    /** Updates the value using the given transform function. */
    update(transform: PurePtr.Transform<T>): void;
    equals(truthyValue: T): PurePtr<boolean>;
    get isTruthy(): true | undefined;
    enabled(defaultValue?: T): PurePtr<boolean>;
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
    find(this: PurePtr<ArrayType<T>>, predicate: (element: ArrayElement<T>, idx: number) => boolean): PurePtr<ArrayElement<T>> | undefined;
    remove(this: PurePtr<ArrayType<T>>, predicate: (element: ArrayElement<T>, idx: number) => boolean): void;
    removeSelf(): void;
    filter(this: PurePtr<ArrayType<T>>, predicate: (element: ArrayElement<T>, idx: number) => boolean): PurePtr<ArrayElement<T>>[];
    clone(): T;
    /**
     * Create pointers to the given object properties.
     *
     * @returns {ObjPropPtr<any, any>[]} An array of pointers.
     */
    pick<K extends (keyof T)[]>(...keys: K): {
        [I in keyof K]: ObjPropPtr<T[K[I]], K[I]>;
    };
    /**
     * Validate pointer with predicate. Can be chained.
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
    /** Create pointer out of its value and the set function */
    function value<T>(value: T, set: (x: T) => void): PurePtr<T>;
    function mutable<T extends object>(state: T): PurePtr<T>;
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
