export declare type Transform<T> = (value: T, event?: {}) => T;
export declare type EventHandler = (event: {}) => void;
export interface Validator<T> {
    (value: T): boolean;
    error?: any;
}
export { StateRef as Link };
export declare abstract class StateRef<T> {
    value: T;
    static value<T>(value: T, set: (x: T) => void): StateRef<T>;
    /**
    * Unwrap object with links, returning an object of a similar shape filled with link values.
    */
    static getValues<K extends keyof L, L extends RefsHash>(links: L): {
        [name in K]: any;
    };
    current: T;
    private readonly _changeToken;
    /**
     * Unwrap object with links, returning an object of a similar shape filled with link errors.
     */
    static getErrors<K extends keyof L, L extends RefsHash>(links: L): {
        [name in K]: L[name]["value"];
    };
    /**
     * Return true if an object with links contains any errors.
     */
    static hasErrors<L extends RefsHash>(links: L): boolean;
    /**
    * Assing links with values from the source object.
    */
    static setValues(links: RefsHash, source: object): void;
    constructor(value: T);
    error: any;
    abstract set(x: T): void;
    onChange(handler: (x: T) => void): StateRef<T>;
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
    pipe(handler: Transform<T>): StateRef<T>;
    action(transform: Transform<T>): EventHandler;
    equals(truthyValue: T): StateRef<boolean>;
    enabled(defaultValue?: T): StateRef<boolean>;
    contains<E>(this: StateRef<E[]>, element: E): StateRef<boolean>;
    push<E>(this: StateRef<E[]>, ...args: E[]): void;
    unshift<E>(this: StateRef<E[]>, ...args: E[]): void;
    splice(start: number, deleteCount?: number): any;
    map<E, Z>(this: StateRef<E[]>, iterator: (link: RefAt<E, number>, idx: number) => Z): Z[];
    map<E, Z>(this: StateRef<{
        [key: string]: E;
    }>, iterator: (link: RefAt<E, string>, idx: string) => Z): Z[];
    removeAt<E>(this: StateRef<E[]>, key: number): void;
    removeAt<E>(this: StateRef<{
        [key: string]: E;
    }>, key: string): void;
    at<E>(this: StateRef<E[]>, key: number): RefAt<E, number>;
    at<K extends keyof T, E extends T[K]>(key: K): RefAt<E, K>;
    clone(): T;
    /**
     * Convert link to object to the object of links. Optionally filter by
     */
    pick<K extends keyof T>(...keys: K[]): {
        [P in K]: StateRef<T[P]>;
    };
    /**
     * Convert link to object to the object of links with $-keys.
     */
    $links(): {
        [key: string]: StateRef<any>;
    };
    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    check(whenValid: Validator<T>, error?: any): this;
}
export declare class CustomStateRef<T> extends StateRef<T> {
    set(x: any): void;
    constructor(value: T, set: (x: T) => void);
}
export declare class ClonedStateRef<T> extends StateRef<T> {
    set(x: any): void;
    constructor(parent: StateRef<T>, set: (x: T) => void);
}
export declare class EqualsRef extends StateRef<boolean> {
    parent: StateRef<any>;
    truthyValue: any;
    constructor(parent: StateRef<any>, truthyValue: any);
    set(x: boolean): void;
}
export declare class EnabledRef extends StateRef<boolean> {
    parent: StateRef<any>;
    defaultValue: any;
    constructor(parent: StateRef<any>, defaultValue: any);
    set(x: boolean): void;
}
export declare class ContainsRef extends StateRef<boolean> {
    parent: StateRef<any>;
    element: any;
    constructor(parent: StateRef<any>, element: any);
    set(x: boolean): void;
}
/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 */
export declare class RefAt<E, K> extends StateRef<E> {
    private parent;
    key: K;
    constructor(parent: StateRef<any>, key: K);
    remove(): void;
    set(x: E): void;
}
export interface RefsHash {
    [name: string]: StateRef<any>;
}
