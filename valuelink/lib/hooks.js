import * as tslib_1 from "tslib";
import { useEffect, useRef, useState } from 'react';
import { helpers } from './helpers';
import { Link as StateRef } from './link';
var UseStateRef = /** @class */ (function (_super) {
    tslib_1.__extends(UseStateRef, _super);
    function UseStateRef(value, set) {
        var _this = _super.call(this, value) || this;
        _this.set = set;
        return _this;
    }
    // Set the component's state value.
    UseStateRef.prototype.set = function (x) { };
    UseStateRef.prototype.update = function (fun, event) {
        // update function must be overriden to use state set
        // ability to delay an update, and to preserve link.update semantic.
        this.set(function (x) {
            var value = helpers(x).clone(x), result = fun(value, event);
            return result === void 0 ? x : result;
        });
    };
    return UseStateRef;
}(StateRef));
export { UseStateRef };
/**
 * Create the ref to the local state.
 */
export function useLink(initialState) {
    var _a = useState(initialState), value = _a[0], set = _a[1];
    return new UseStateRef(value, set);
}
export { useLink as useStateRef, useSafeLink as useSafeStateRef, useBoundLink as useBoundStateRef, useSafeBoundLink as useSafeBoundStateRef };
/**
 * Create the link to the local state which is safe to set when component is unmounted.
 * Use this for the state which is set when async I/O is completed.
 */
export function useSafeLink(initialState) {
    var _a = useState(initialState), value = _a[0], set = _a[1], isMounted = useIsMountedRef();
    return new UseStateRef(value, function (x) { return isMounted.current && set(x); });
}
/**
 * Returns the ref which is true when component it mounted.
 */
export function useIsMountedRef() {
    var isMounted = useRef(true);
    useEffect(function () { return (function () { return isMounted.current = false; }); }, []);
    return isMounted;
}
/**
 * Create the link to the local state which is bound to another
 * value or link in a single direction. When the source changes, the link changes too.
 */
export function useBoundLink(source) {
    var value = source instanceof StateRef ? source.value : source, link = useLink(value);
    useEffect(function () { return link.set(value); }, [value]);
    link.action;
    return link;
}
/**
 * Create the safe link to the local state which is synchronized with another
 * value or link in a single direction.
 * When the source change, the linked state changes too.
 */
export function useSafeBoundLink(source) {
    var value = source instanceof StateRef ? source.value : source, link = useSafeLink(value);
    useEffect(function () { return link.set(value); }, [value]);
    return link;
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
        var savedData = JSON.parse(localStorage.getItem(key) || '{}');
        StateRef.setValues(stateRef.current, savedData);
        return function () {
            var dataToSave = StateRef.getValues(stateRef.current);
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
    // Counter of open I/O requests. If it's 0, I/O is completed.
    // Counter is needed to handle the situation when the next request
    // is issued before the previous one was completed.
    var $isReady = useSafeLink(null);
    useEffect(function () {
        // function in set instead of value to avoid race conditions with counter increment.
        $isReady.set(function (x) { return (x || 0) + 1; });
        fun().finally(function () { return $isReady.set(function (x) { return x - 1; }); });
    }, condition);
    // null is used to detect the first render when no requests issued yet
    // but the I/O is not completed.
    return $isReady.value === null ? false : !$isReady.value;
}
export function whenChanged(a, b, c, d) {
    var length = arguments.length;
    switch (length) {
        case 1: return [extractChangeToken(a)];
        case 2: return [extractChangeToken(a), extractChangeToken(b)];
        case 3: return [extractChangeToken(a), extractChangeToken(b), extractChangeToken(c)];
        default:
            var array = [extractChangeToken(a), extractChangeToken(b), extractChangeToken(c), extractChangeToken(d)];
            for (var i = 4; i < length; i++) {
                array.push(extractChangeToken(arguments[i]));
            }
            return array;
    }
}
function extractChangeToken(x) {
    return x && x._changeToken !== void 0 ? x._changeToken : x;
}
//# sourceMappingURL=hooks.js.map