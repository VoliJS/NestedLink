import { useState, useEffect, useRef } from 'react';
import { CustomLink, Link } from './link';
/**
 * Create the linked local state.
 */
export function useLink(initialState) {
    var _a = useState(initialState), value = _a[0], set = _a[1];
    return new CustomLink(value, set);
}
export function useLinkedState(link) {
    var localLink = useLink(link.value);
    useEffect(function () {
        localLink.set(link.value);
    }, [link.value]);
    return localLink;
}
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
//# sourceMappingURL=hooks.js.map