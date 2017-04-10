/// <reference types="react" />
import * as React from 'react';
import { Link, LinksCache } from './link';
export interface DataBindingSource<S> {
    linkAt<K extends keyof S>(key: K): Link<S[K]>;
    linkAll(...keys: (keyof S)[]): LinksCache<S>;
}
export declare abstract class LinkedComponent<P, S> extends React.Component<P, S> implements DataBindingSource<S> {
    links: LinksCache<S>;
    linkAt<K extends keyof S>(key: K): Link<S[K]>;
    linkAll(...args: (keyof S)[]): LinksCache<S>;
}
export declare class StateLink<P, S, K extends keyof S> extends Link<S[K]> {
    component: LinkedComponent<P, S>;
    key: K;
    constructor(component: LinkedComponent<P, S>, key: K, value: S[K]);
    set(x: S[K]): void;
}
