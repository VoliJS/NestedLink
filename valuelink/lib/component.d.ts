import * as React from 'react';
import { Link } from './link';
export declare type LinksCache<S, X extends keyof S> = {
    [K in X]: Link<S[K]>;
};
export interface DataBindingSource<S> {
    linkAt<K extends keyof S>(key: K): Link<S[K]>;
    linkAll<K extends keyof S>(...keys: K[]): LinksCache<S, K>;
    $at<K extends keyof S>(key: K): Link<S[K]>;
    state$<K extends keyof S>(...keys: K[]): LinksCache<S, K>;
}
export declare abstract class LinkedComponent<P, S> extends React.Component<P, S> implements DataBindingSource<S> {
    links: LinksCache<S, keyof S>;
    linkAt<K extends keyof S>(key: K): Link<S[K]>;
    $at<K extends keyof S>(key: K): Link<S[K]>;
    linkAll<K extends keyof S>(...keys: K[]): LinksCache<S, K>;
    /**
     * Get the object with links to the elements of the component's state.
     * const state$ = this.state$();
     *
     * Get the links to the given list of state elements.
     * const state$ = this.state$( 'a', 'b', 'c' );
     */
    state$<K extends keyof S>(...keys: K[]): LinksCache<S, K>;
}
export declare class StateLink<P, S, K extends keyof S> extends Link<S[K]> {
    component: LinkedComponent<P, S>;
    key: K;
    constructor(component: LinkedComponent<P, S>, key: K, value: S[K]);
    set(x: S[K]): void;
}
