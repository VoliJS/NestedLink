import { useState, useEffect, useRef } from 'react';
import { CustomLink, Link } from './link';
/**
 * Create the link to the local state.
 */
export function useLink(initialState) {
    var _a = useState(initialState), value = _a[0], set = _a[1];
    return new CustomLink(value, set);
}
/**
 * Create the link to the local state which is synchronized with another link
 * in one direction. When the link change, the linked state changes too.
 */
export function useLinkedState(link) {
    var localLink = useLink(link.value);
    useEffect(function () {
        localLink.set(link.value);
    }, [link.value]);
    return localLink;
}
/**
 * Persists links in local storage under the given key.
 * Links will be loaded on component's mount, and saved on unmount.
 * @param key - string key for the localStorage entry.
 * @param state - links to persist wrapped in an object `{ lnk1, lnk2, ... }`
 */
export function useLocalStorage(key, state) {
    // save state to use on unmount...
    var stateRef = useRef();
    stateRef.current = state;
    useEffect(function () {
        var savedData = JSON.parse(localStorage.getItem('todos') || '{}');
        Link.setValues(stateRef.current, savedData);
        return function () {
            var dataToSave = Link.getValues(stateRef.current);
            localStorage.setItem(key, JSON.stringify(dataToSave));
        };
    }, []);
}
/**
 * Wait for the promise (or async function) completion.
 * Execute operation once when mounted, returning `null` while the operation is pending.
 * When operation is completed, returns "ok" or "fail" depending on the result and
 * forces the local component update.
 *
 * const isReady = useIO( async () => {
 *      const data = await fetchData();
 *      link.set( data );
 * });
 */
export function useIO(fun, condition) {
    if (condition === void 0) { condition = []; }
    // save state to use on unmount...
    var _a = useState(null), isReady = _a[0], setIsReady = _a[1];
    useEffect(function () {
        fun()
            .then(function () { return setIsReady("ok"); })
            .catch(function () { return setIsReady("fail"); });
        return function () {
            setIsReady(null);
        };
    }, condition);
    return isReady;
}
//# sourceMappingURL=hooks.js.map