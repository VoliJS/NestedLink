export * from './helpers';
export declare type Transform<T> = (value: T, event?: {}) => T;
export declare type EventHandler = (event: {}) => void;
export interface Validator<T> {
    (value: T): boolean;
    error?: any;
}
export declare abstract class ValueLink<T> {
    value: T;
    static value<T>(value: T, set: (x: T) => void): ValueLink<T>;
    /**
    * Unwrap object with links, returning an object of a similar shape filled with link values.
    */
    static getValues<K extends keyof L, L extends ValueLinkHash>(links: L): {
        [name in K]: any;
    };
    current: T;
    protected readonly _changeToken: T;
    /**
     * Unwrap object with links, returning an object of a similar shape filled with link errors.
     */
    static getErrors<K extends keyof L, L extends ValueLinkHash>(links: L): {
        [name in K]: L[name]["value"];
    };
    /**
     * Return true if an object with links contains any errors.
     */
    static hasErrors<L extends ValueLinkHash>(links: L): boolean;
    /**
    * Assing links with values from the source object.
    */
    static setValues(links: ValueLinkHash, source: object): void;
    constructor(value: T);
    error: any;
    abstract set(x: T): void;
    onChange(handler: (x: T) => void): ValueLink<T>;
    readonly props: {
        checked: (T & false) | (T & true);
        onChange: (e: any) => void;
        value?: undefined;
    } | {
        value: T;
        onChange: (e: any) => void;
        checked?: undefined;
    };
    update(transform: Transform<T>, e?: Object): void;
    pipe(handler: Transform<T>): ValueLink<T>;
    action(transform: Transform<T>): EventHandler;
    equals(truthyValue: T): ValueLink<boolean>;
    enabled(defaultValue?: T): ValueLink<boolean>;
    contains<E>(this: ValueLink<E[]>, element: E): ValueLink<boolean>;
    push<E>(this: ValueLink<E[]>, ...args: E[]): void;
    unshift<E>(this: ValueLink<E[]>, ...args: E[]): void;
    splice(start: number, deleteCount?: number): any;
    map<E, Z>(this: ValueLink<E[]>, iterator: (link: PropValueLink<E, number>, idx: number) => Z): Z[];
    map<E, Z>(this: ValueLink<{
        [key: string]: E;
    }>, iterator: (link: PropValueLink<E, string>, idx: string) => Z): Z[];
    removeAt<E>(this: ValueLink<E[]>, key: number): void;
    removeAt<E>(this: ValueLink<{
        [key: string]: E;
    }>, key: string): void;
    at<E>(this: ValueLink<E[]>, key: number): PropValueLink<E, number>;
    at<K extends keyof T, E extends T[K]>(key: K): PropValueLink<E, K>;
    clone(): T;
    /**
     * Convert link to object to the object of links. Optionally filter by
     */
    pick<K extends keyof T>(...keys: K[]): {
        [P in K]: ValueLink<T[P]>;
    };
    /**
     * Convert link to object to the object of links with $-keys.
     */
    $links(): {
        [key: string]: ValueLink<any>;
    };
    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    check(whenValid: Validator<T>, error?: any): this;
}
export declare class CustomValueLink<T> extends ValueLink<T> {
    set(x: any): void;
    constructor(value: T, set: (x: T) => void);
}
export declare class ClonedValueLink<T> extends ValueLink<T> {
    set(x: any): void;
    constructor(parent: ValueLink<T>, set: (x: T) => void);
}
export declare class EqualsValueLink extends ValueLink<boolean> {
    parent: ValueLink<any>;
    truthyValue: any;
    constructor(parent: ValueLink<any>, truthyValue: any);
    set(x: boolean): void;
}
export declare class EnabledValueLink extends ValueLink<boolean> {
    parent: ValueLink<any>;
    defaultValue: any;
    constructor(parent: ValueLink<any>, defaultValue: any);
    set(x: boolean): void;
}
export declare class ContainsRef extends ValueLink<boolean> {
    parent: ValueLink<any>;
    element: any;
    constructor(parent: ValueLink<any>, element: any);
    set(x: boolean): void;
}
/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 */
export declare class PropValueLink<E, K> extends ValueLink<E> {
    private parent;
    key: K;
    constructor(parent: ValueLink<any>, key: K);
    remove(): void;
    set(x: E): void;
}
export interface ValueLinkHash {
    [name: string]: ValueLink<any>;
}
