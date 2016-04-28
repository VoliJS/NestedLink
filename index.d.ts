/**
 * Advanced React links for purely functional two-way data binding
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */
export declare type Transform = (value: any, event?: Object) => any;
export declare type EventHandler = (event: Object) => void;
export declare type Validator = (value: any) => boolean;
export declare type Iterator = (link: ChainedLink, key: string | number) => any;
export interface StatefulComponent {
    state: Object;
    setState: (attrs: Object) => void;
}
export default class Link {
    value: any;
    constructor(value: any);
    error: any;
    validationError: any;
    set(x: any): void;
    requestChange(x: any): void;
    static state(component: StatefulComponent, key: string): StateLink;
    static custom(value: any, set: (x) => void): CustomLink;
    toggle(): void;
    contains(element: any): ContainsLink;
    update(transform: Transform, e?: Object): void;
    action(transform: Transform): EventHandler;
    equals(truthyValue: any): EqualsLink;
    at(key: string | number): ChainedLink;
    map(iterator: Iterator): any[];
    /**
     * Validate link with validness predicate and optional custom error object. Can be chained.
     */
    check(whenValid: Validator, error?: any): this;
}
export declare class CustomLink extends Link {
    constructor(value: any, set: (x) => void);
}
export declare class StateLink extends Link {
    component: StatefulComponent;
    key: string;
    constructor(component: StatefulComponent, key: string);
    set(x: any): void;
}
export declare class EqualsLink extends Link {
    parent: Link;
    truthyValue: any;
    value: boolean;
    constructor(parent: Link, truthyValue: any);
    set(x: boolean): void;
}
export declare class ContainsLink extends Link {
    parent: Link;
    element: any;
    value: boolean;
    constructor(parent: Link, element: any);
    set(x: boolean): void;
}
/**
 * Link to array or object element enclosed in parent link.
 * Performs purely functional update of the parent, shallow copying its value on `set`.
 */
export declare class ChainedLink extends Link {
    parent: Link;
    key: string | number;
    constructor(parent: Link, key: string | number);
    set(x: any): void;
}
