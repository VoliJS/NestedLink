export * from './helpers';
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
    contains<E>(this: PurePtr<E[]>, element: E): PurePtr<boolean>;
    push<E>(this: PurePtr<E[]>, ...args: E[]): void;
    unshift<E>(this: PurePtr<E[]>, ...args: E[]): void;
    splice(this: PurePtr<any[]>, start: number, deleteCount?: number): void;
    map<E, Z>(this: PurePtr<E[]>, iterator: (link: ObjPropPtr<E, number>, idx: number) => Z): Z[];
    map<E, Z>(this: PurePtr<{
        [key: string]: E;
    }>, iterator: (link: ObjPropPtr<E, string>, idx: string) => Z): Z[];
    removeAt<E>(this: PurePtr<E[]>, key: number): void;
    removeAt<E>(this: PurePtr<{
        [key: string]: E;
    }>, key: string): void;
    at<E>(this: PurePtr<E[]>, key: number): ObjPropPtr<E, number>;
    at<K extends keyof T, E extends T[K]>(key: K): ObjPropPtr<E, K>;
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
    remove(): void;
    update(transform: PurePtr.Transform<E>): void;
    set(next: E): void;
}
