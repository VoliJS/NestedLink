import { helpers, PurePtr } from '@pure-ptr/core';
import { useEffect, useRef, useState } from 'react';
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
 * Create the ref to the local state.
 */
export function useStatePtr(initialState) {
    const [value, set] = useState(initialState);
    return new UseStatePtr(value, set);
}
/**
 * Returns the ref which is true when component it mounted.
 */
export function useIsMountedRef() {
    const isMounted = useRef(true);
    useEffect(() => () => {
        isMounted.current = false;
    }, []);
    return isMounted;
}
/**
 * Create a pointer to the local state that is synchronized with another
 * value or pointer in a single direction. When the source changes, the linked state changes too.
 */
export function useLinkedStatePtr(source) {
    const value = source instanceof PurePtr ? source.value : source, link = useStatePtr(value);
    useEffect(() => link.set(value), [value]);
    return link;
}
function getInitialState(initialState) {
    return typeof initialState === 'function' ? initialState() : initialState;
}
export function useLocalStoragePtr(key, initialState) {
    const [value, setValue] = useState(() => JSON.parse(localStorage.getItem(key) || 'null') || getInitialState(initialState));
    return new UseStatePtr(value, x => {
        localStorage.setItem(key, JSON.stringify(x));
        setValue(x);
    });
}
export function useSessionStoragePtr(key, initialState) {
    const [value, setValue] = useState(() => JSON.parse(sessionStorage.getItem(key) || 'null') || getInitialState(initialState));
    return new UseStatePtr(value, x => {
        sessionStorage.setItem(key, JSON.stringify(x));
        setValue(x);
    });
}
/**
 * Custom hook to handle asynchronous operations with support for cancellation and component unmounting.
 *
 * @template T - The type of the result returned by the asynchronous function.
 * @param {function(AbortController): Promise<T>} fun - The asynchronous function to execute. It receives an AbortController to handle cancellation.
 * @param {any[]} [condition=[]] - An array of dependencies that will trigger the effect when changed.
 * @returns {object} - An object containing:
 *   - `isReady` (boolean): Indicates if the operation is complete.
 *   - `result` (T | null): The result of the asynchronous operation.
 *   - `error` (any): The error encountered during the operation, if any.
 *   - `refresh` (function): A function to re-trigger the asynchronous operation.
 */
export function useIO(fun, condition = []) {
    const [state, setState] = useState(() => ({
        isPending: 0,
        result: null,
        error: null,
        timestamp: 0
    }));
    // Ref to track if the component is mounted
    const isMountedRef = useIsMountedRef();
    // Ref to hold the latest AbortController
    const abortControllerRef = useRef(null);
    useEffect(() => {
        // function in set instead of value to avoid race conditions with counter increment.
        setState(state => ({
            isPending: state.isPending + 1,
            result: null,
            error: null,
            timestamp: state.timestamp
        }));
        fun(abortControllerRef.current = new AbortController())
            .then(result => {
            if (isMountedRef.current) {
                setState(state => ({
                    isPending: state.isPending - 1,
                    result,
                    error: null,
                    timestamp: state.timestamp
                }));
            }
        })
            .catch(error => {
            if (isMountedRef.current) {
                setState(state => ({
                    isPending: state.isPending - 1,
                    result: null,
                    error: error.name !== 'AbortError' ? error : null,
                    timestamp: state.timestamp
                }));
            }
        })
            .finally(() => {
            if (isMountedRef.current) {
                abortControllerRef.current = null;
            }
        });
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, [...condition, state.timestamp]);
    return {
        isReady: !state.isPending,
        result: state.result,
        error: state.error,
        refresh: () => setState(state => ({ ...state, timestamp: Date.now() }))
    };
}
/**
 * A custom hook that throttles the execution of a function.
 *
 * @template F - The type of the function to be throttled.
 * @param {F} fun - The function to be throttled.
 * @param {number} timeout - The delay in milliseconds for the throttle.
 * @param {Array<any>} [changes=[]] - The list of dependencies that will trigger the effect.
 * @returns {F} - The throttled function.
 *
 * @example
 * ```typescript
 * const throttledFunction = useThrottle(myFunction, 1000, [dependency]);
 * ```
 */
export function useThrottle(fun, timeout, changes = []) {
    // Create the ref to store timer.
    const timer = useRef(null);
    function cancel() {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }
    useEffect(() => cancel, changes);
    return function (...args) {
        cancel();
        timer.current = setTimeout(() => {
            timer.current = null;
            fun.apply(null, args);
        }, timeout);
    };
}
/**
 * React Hook to execute a function on a timer interval.
 *
 * @param {function} fun - The function to execute on each interval.
 * @param {number} interval - The interval duration in milliseconds.
 * @param {any[]} [deps=[]] - An array of dependencies that will trigger the effect when changed.
 */
export function useInterval(fun, interval, deps = []) {
    useEffect(() => {
        const id = setInterval(fun, interval);
        return () => clearInterval(id);
    }, [interval, ...deps]);
}
