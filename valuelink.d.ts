/**
 * Advanced React links for purely functional two-way data binding
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
export declare type Transform<T> = (value: T, event?: {}) => T;
export declare type EventHandler = (event: {}) => void;
export interface Validator<T> {
    (value: T): boolean;
    error?: any;
}
export declare type Iterator = (link: ChainedLink, key: string | number) => any;
export declare type StateLinks = {
    [attrName: string]: StateLink<any>;
};
export declare type ChainedLinks = {
    [attrName: string]: ChainedLink;
};
export interface StatefulComponent {
    state: {};
    setState: (attrs: {}) => void;
    links?: StateLinks;
}
declare abstract class Link<T> {
    value: T;
    static state<T>(component: StatefulComponent, key: string): StateLink<T>;
    static all(component: StatefulComponent): StateLinks;
    static value<T>(value: T, set: (x: T) => void): CustomLink<T>;
    constructor(value: T);
    error: any;
    readonly validationError: any;
    abstract set(x: T): void;
    onChange(handler: (x: T) => void): CloneLink<T>;
    requestChange(x: T): void;
    update(transform: Transform<T>, e?: Object): void;
    pipe(handler: Transform<T>): CloneLink<T>;
    action(transform: Transform<T>): EventHandler;
    equals(truthyValue: any): EqualsLink;
    enabled(defaultValue?: string): EnabledLink;
    contains(element: any): ContainsLink;
    push(): void;
    unshift(): void;
    splice(): void;
    map(iterator: Iterator): any[];
    remove(key: string | number): void;
    at(key: string | number): ChainedLink;
    clone(): T;
    pick(): ChainedLinks;
    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    check(whenValid: Validator<T>, error?: any): this;
}
export default Link;
export declare class CustomLink<T> extends Link<T> {
    set(x: any): void;
    constructor(value: T, set: (x: T) => void);
}
export declare class CloneLink<T> extends Link<T> {
    set(x: any): void;
    constructor(parent: Link<T>, set: (x: T) => void);
}
export declare class StateLink<T> extends Link<T> {
    component: StatefulComponent;
    key: string;
    constructor(value: T, component: StatefulComponent, key: string);
    set(x: T): void;
}
export declare class EqualsLink extends Link<boolean> {
    parent: Link<any>;
    truthyValue: any;
    constructor(parent: Link<any>, truthyValue: any);
    set(x: boolean): void;
}
export declare class EnabledLink extends Link<boolean> {
    parent: Link<any>;
    defaultValue: any;
    constructor(parent: Link<any>, defaultValue: any);
    set(x: boolean): void;
}
export declare class ContainsLink extends Link<boolean> {
    parent: Link<any>;
    element: any;
    constructor(parent: Link<any>, element: any);
    set(x: boolean): void;
}
/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 */
export declare class ChainedLink extends Link<any> {
    parent: Link<{}>;
    key: string | number;
    constructor(parent: Link<{}>, key: string | number);
    remove(key?: any): void;
    set(x: any): void;
}
