import { PurePtr } from '@pure-ptr/core';
/**
 * Create a pointer to a local component state.
 *
 * @param {S | (() => S)} initialState - The initial state value or a function that returns the initial state.
 * @returns {PurePtr<S>} PurePtr containing the state value and the state setter function.
 */
export declare function useStatePtr<S>(initialState: S | (() => S)): PurePtr<S>;
/**
 * Returns the ref which is true when component it mounted.
 */
export declare function useIsMountedRef(): import("react").MutableRefObject<boolean>;
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
export declare function useLinkedStatePtr<T>(source: T | PurePtr<T>): PurePtr<T>;
/**
 * Create a pointer to a local storage.
 *
 * @param {string} key - The key under which the state is stored in session storage.
 * @param {S | (() => S)} initialState - The initial state or a function that returns the initial state.
 * @returns {ReturnType<typeof useStatePtr<S>>} A state pointer that is synchronized with session storage.
 */
export declare function useLocalStoragePtr<S>(key: string, initialState: S | (() => S)): PurePtr<S>;
/**
 * Create a pointer to a session storage.
 *
 * @param {string} key - The key under which the state is stored in session storage.
 * @param {S | (() => S)} initialState - The initial state or a function that returns the initial state.
 * @returns {ReturnType<typeof useStatePtr<S>>} A state pointer that is synchronized with session storage.
 */
export declare function useSessionStoragePtr<S>(key: string, initialState: S | (() => S)): PurePtr<S>;
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
export declare function useAsyncEffect<T>(fun: (signal: AbortSignal) => Promise<T>, condition?: any[]): {
    result: T | null;
    error: any;
    isPending: 'mount' | 'refresh' | 'update' | null;
    reload: () => void;
};
/**
 * A custom hook that throttles the execution of a function.
 *
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
export declare function useThrottle<F extends (...args: any) => void>(fun: F, timeout: number, changes?: any[]): F;
/**
 * React Hook to execute a function on a timer interval.
 *
 * @param {function} fun - The function to execute on each interval.
 * @param {number} interval - The interval duration in milliseconds.
 * @param {any[]} [deps=[]] - An array of dependencies that will trigger the effect when changed.
 */
export declare function useInterval(fun: () => void, interval: number, deps?: any[]): void;
