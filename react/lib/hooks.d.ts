import { PurePtr } from '@pure-ptr/core';
declare class UseStatePtr<T> extends PurePtr<T> {
    set(x: T | ((x: T) => T)): void;
    update(fun: (x: T, event?: Object) => T, event?: Object): void;
    constructor(value: T, set: (x: T | ((x: T) => T)) => void);
}
/**
 * Create the ref to the local state.
 */
export declare function useStatePtr<S>(initialState: S | (() => S)): UseStatePtr<S>;
/**
 * Returns the ref which is true when component it mounted.
 */
export declare function useIsMountedRef(): import("react").MutableRefObject<boolean>;
/**
 * Create a pointer to the local state that is synchronized with another
 * value or pointer in a single direction. When the source changes, the linked state changes too.
 */
export declare function useLinkedStatePtr<T>(source: T | PurePtr<T>): PurePtr<T>;
export declare function useLocalStoragePtr<S>(key: string, initialState: S | (() => S)): PurePtr<S>;
export declare function useSessionStoragePtr<S>(key: string, initialState: S | (() => S)): PurePtr<S>;
/**
 * Custom hook to handle asynchronous operations with support for cancellation and component unmounting.
 *
 * @template T - The type of the result returned by the asynchronous function.
 * @param {function(AbortSignal): Promise<T>} fun - The asynchronous function to execute. It receives an AbortController to handle cancellation.
 * @param {any[]} [condition=[]] - An array of dependencies that will trigger the effect when changed.
 * @returns {object} - An object containing:
 *   - `isReady` (boolean): Indicates if the operation is complete.
 *   - `result` (T | null): The result of the asynchronous operation.
 *   - `error` (any): The error encountered during the operation, if any.
 *   - `hasBeenRefreshed` (boolean): Indicates if the operation has been refreshed at least once.
 *   - `refresh` (function): A function to re-trigger the asynchronous operation.
 */
export declare function useIO<T>(fun: (signal: AbortSignal) => Promise<T>, condition?: any[]): {
    isReady: boolean;
    result: T | null;
    error: any;
    hasBeenRefreshed: boolean;
    refresh: () => void;
};
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
export declare function useThrottle<F extends (...args: any) => void>(fun: F, timeout: number, changes?: any[]): F;
/**
 * React Hook to execute a function on a timer interval.
 *
 * @param {function} fun - The function to execute on each interval.
 * @param {number} interval - The interval duration in milliseconds.
 * @param {any[]} [deps=[]] - An array of dependencies that will trigger the effect when changed.
 */
export declare function useInterval(fun: () => void, interval: number, deps?: any[]): void;
export {};
