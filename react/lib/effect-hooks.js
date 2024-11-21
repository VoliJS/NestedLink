import { useEffect, useRef, useState } from "react";
import { useIsMountedRef } from "./imperative-hooks";
/**
 * Custom hook to handle asynchronous operations with support for cancellation and component unmounting.
 *
 * @template T - The type of the result returned by the asynchronous function.
 * @param {function(AbortSignal): Promise<T>} fun - The asynchronous function to execute. It receives an AbortController to handle cancellation.
 * @param {any[]} [condition=[]] - An array of dependencies that will trigger the effect when changed.
 * @returns {object} - An object containing:
 *   - `isPending` ('mount' | 'refresh' | 'update' | null): Indicates the state of the operation.
 *   - `result` (T | null): The result of the asynchronous operation.
 *   - `error` (any): The error encountered during the operation, if any.
 *   - `reload` (function): A function to re-trigger the asynchronous operation.
 *
 * @example
 * ```typescript
 * const { isPending, result, error, reload } = useAsyncEffect(myFunction, [dependency]);
 *
 * if( isPending ){
 *    return <div>Loading...</div>;
 * }
 * ```
 */
export function useAsyncEffect(fun, condition = []) {
    const [state, setState] = useState(() => ({
        isPending: 0,
        result: null,
        error: null,
        timestamp: 0,
        reason: 'mount'
    }));
    // Ref to track if the component is mounted
    const isMountedRef = useIsMountedRef();
    // Ref to hold the latest AbortController
    const abortControllerRef = useRef(null);
    useEffect(() => {
        abortControllerRef.current = new AbortController();
        fun(abortControllerRef.current.signal)
            .then(result => {
            if (isMountedRef.current) {
                setState(state => ({
                    isPending: state.isPending - 1,
                    result,
                    error: null,
                    timestamp: state.timestamp,
                    reason: state.isPending === 1 ? null : state.reason
                }));
            }
        })
            .catch(error => {
            if (isMountedRef.current) {
                setState(state => ({
                    isPending: state.isPending - 1,
                    result: null,
                    error: error.name !== 'AbortError' ? error : null,
                    timestamp: state.timestamp,
                    reason: state.isPending === 1 ? null : state.reason
                }));
            }
        })
            .finally(() => {
            if (isMountedRef.current) {
                abortControllerRef.current = null;
            }
        });
        // function in set instead of value to avoid race conditions with counter increment.
        setState(state => ({
            isPending: state.isPending + 1,
            result: null,
            error: null,
            timestamp: state.timestamp,
            reason: state.reason || 'update'
        }));
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, [...condition, state.timestamp]);
    return {
        result: state.result,
        error: state.error,
        isPending: state.reason,
        reload: () => state.isPending || setState(state => ({ ...state, reason: 'refresh', timestamp: Date.now() }))
    };
}
/**
 * A custom hook that runs an effect immediately when dependencies change,
 * and cleans up the previous effect if it exists.
 *
 * @template T - The type of the cleanup function.
 * @param {() => CleanupFn | void} fn - The effect function to run. It can return a cleanup function.
 * @param {DependencyList} deps - The list of dependencies that the effect depends on.
 *
 * @example
 * useImmediateEffect(() => {
 *   const id = setInterval(() => {
 *     console.log('Interval running');
 *   }, 1000);
 *
 *   return () => clearInterval(id);
 * }, [someDependency]);
 */
export function useImmediateEffect(fn, deps) {
    const prevDeps = useRef();
    const cleanupRef = useRef();
    if (!prevDeps.current || !deps.every((x, i) => Object.is(x, prevDeps.current[i]))) {
        // Run previous cleanup if exists
        if (cleanupRef.current) {
            cleanupRef.current();
        }
        // Execute the effect and store its cleanup function
        cleanupRef.current = fn();
        // Update dependencies reference
        prevDeps.current = deps;
    }
    // Handle cleanup on unmount
    useEffect(() => () => {
        if (cleanupRef.current) {
            cleanupRef.current();
        }
    }, []);
}
