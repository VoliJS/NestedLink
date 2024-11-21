import { helpers, PurePtr } from '@pure-ptr/core';
import { useEffect, useState } from 'react';
class UseStatePtr extends PurePtr {
    // Set the component's state value.
    set(x) { }
    update(fun, event) {
        // update function must be overriden to use state set
        // ability to delay an update, and to preserve link.update semantic.
        this.set(x => {
            const value = helpers(x).clone(x), result = fun(value, event);
            return result === void 0 ? x : result;
        });
    }
    constructor(value, set) {
        super(value);
        this.set = set;
    }
}
/**
 * Create a pointer to a local component state.
 *
 * @param {S | (() => S)} initialState - The initial state value or a function that returns the initial state.
 * @returns {PurePtr<S>} PurePtr containing the state value and the state setter function.
 */
export function useStatePtr(initialState) {
    const [value, set] = useState(initialState);
    return new UseStatePtr(value, set);
}
/**
 * Create a pointer to the local state that is synchronized with another
 * value or pointer in a single direction. When the source changes, the linked state changes too.
 *
 * If the source is an instance of `PurePtr`, it uses the value of the pointer.
 * Otherwise, it uses the source value directly.
 *
 * @template T - The type of the value.
 * @param {T | PurePtr<T>} source - The source value or pointer.
 * @returns {PurePtr<T>} - A linked state pointer.
 */
export function useLinkedStatePtr(source) {
    const value = source instanceof PurePtr ? source.value : source, link = useStatePtr(value);
    useEffect(() => link.set(value), [value]);
    return link;
}
function getInitialState(initialState) {
    return typeof initialState === 'function' ? initialState() : initialState;
}
/**
 * Create a pointer to a local storage.
 *
 * @param {string} key - The key under which the state is stored in session storage.
 * @param {S | (() => S)} initialState - The initial state or a function that returns the initial state.
 * @returns {ReturnType<typeof useStatePtr<S>>} A state pointer that is synchronized with session storage.
 */
export function useLocalStoragePtr(key, initialState) {
    const valuePtr = useStatePtr(() => JSON.parse(localStorage.getItem(key) || 'null') || getInitialState(initialState));
    return valuePtr.onChange(x => {
        localStorage.setItem(key, JSON.stringify(x));
    });
}
/**
 * Create a pointer to a session storage.
 *
 * @param {string} key - The key under which the state is stored in session storage.
 * @param {S | (() => S)} initialState - The initial state or a function that returns the initial state.
 * @returns {ReturnType<typeof useStatePtr<S>>} A state pointer that is synchronized with session storage.
 */
export function useSessionStoragePtr(key, initialState) {
    const valuePtr = useStatePtr(() => JSON.parse(sessionStorage.getItem(key) || 'null') || getInitialState(initialState));
    return valuePtr.onChange(x => {
        sessionStorage.setItem(key, JSON.stringify(x));
    });
}
//# sourceMappingURL=state-hooks.js.map