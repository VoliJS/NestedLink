export * from './helpers';
/**
 * `Linked` class is an abstract linked value - the value, the function to update this value, and its validation error.
 * The enclosed value is considered as immutable.
 */
export declare abstract class Linked<T> {
    value: T;
    /** Validation error. Usually is a string with error text, but can hold any type. */
    error: any;
    /** Set linked value */
    abstract set(x: T): void;
    constructor(value: T);
    /** EXPERIMENTAL: Support useRef interface. */
    current: T;
    protected readonly _changeToken: T;
    /** Produce the new link executing the given function before the link value will be updated. */
    onChange(handler: (x: T) => void): Linked<T>;
    /** Produce the new link which transform the value before `set` with a given function. */
    pipe(handler: Linked.Transform<T>): Linked<T>;
    /**
     * Create React component props for the <input> component.
     *
     * <input { ...link.props } />
     */
    readonly props: {
        checked: (T & false) | (T & true);
        onChange: (e: any) => void;
        value?: undefined;
    } | {
        value: T;
        onChange: (e: any) => void;
        checked?: undefined;
    };
    /** Update the linked value using given transform function. */
    update(transform: Linked.Transform<T>, e?: Object): void;
    action(transform: Linked.Transform<T>): Linked.EventHandler;
    equals(truthyValue: T): Linked<boolean>;
    readonly true: () => void;
    readonly false: () => void;
    readonly null: () => void;
    readonly isTruthy: boolean;
    enabled(defaultValue?: T): Linked<boolean>;
    contains<E>(this: Linked<E[]>, element: E): Linked<boolean>;
    push<E>(this: Linked<E[]>, ...args: E[]): void;
    unshift<E>(this: Linked<E[]>, ...args: E[]): void;
    splice(this: Linked<any[]>, start: number, deleteCount?: number): void;
    map<E, Z>(this: Linked<E[]>, iterator: (link: PropValueLink<E, number>, idx: number) => Z): Z[];
    map<E, Z>(this: Linked<{
        [key: string]: E;
    }>, iterator: (link: PropValueLink<E, string>, idx: string) => Z): Z[];
    removeAt<E>(this: Linked<E[]>, key: number): void;
    removeAt<E>(this: Linked<{
        [key: string]: E;
    }>, key: string): void;
    at<E>(this: Linked<E[]>, key: number): PropValueLink<E, number>;
    at<K extends keyof T, E extends T[K]>(key: K): PropValueLink<E, K>;
    clone(): T;
    /**
     * Convert link to object to the object of links. Optionally filter by
     */
    pick<K extends keyof T>(...keys: K[]): {
        [P in K]: Linked<T[P]>;
    };
    /**
     * Convert link to object to the object of links.
     * Memorises the result, subsequent calls are cheap.
     */
    readonly $: T extends object ? Linked.Hash<T> : never;
    private _value$;
    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    check(whenValid: Linked.Validator<T>, error?: any): this;
}
export declare namespace Linked {
    interface Validator<T> {
        (value: T): boolean;
        error?: any;
    }
    type Transform<T> = (value: T, event?: {}) => T;
    type EventHandler = (event: {}) => void;
    type Hash<T extends object = any> = {
        [K in keyof T]: Linked<T[K]>;
    };
    /** Create linked value out of its value and the set function */
    function value<T>(value: T, set: (x: T) => void): Linked<T>;
    function mutable<T extends object>(state: T): Linked<T>;
    /**
    * Unwrap object with links, returning an object of a similar shape filled with link values.
    */
    function getValues<T extends object>(links: Linked.Hash<T>): T;
    /**
     * Unwrap object with links, returning an object of a similar shape filled with link errors.
     */
    function getErrors<T extends object>(links: Linked.Hash<T>): {
        [name in keyof T]: any;
    };
    /**
     * Return true if an object with links contains any errors.
     */
    function hasErrors<T extends object>(links: Linked.Hash<T>): boolean;
    /**
    * Assing links with values from the source object.
    */
    function setValues<T extends object>(links: Linked.Hash<T>, source: T): void;
}
/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 */
export declare class PropValueLink<E, K> extends Linked<E> {
    private parent;
    key: K;
    constructor(parent: Linked<any>, key: K);
    remove(): void;
    update(transform: Linked.Transform<E>, e?: Object): void;
    set(next: E): void;
}
