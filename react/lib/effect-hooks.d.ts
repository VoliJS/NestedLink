import { DependencyList } from "react";
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
type CleanupFn = () => void;
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
export declare function useImmediateEffect<T>(fn: () => CleanupFn | void, deps: DependencyList): void;
export {};
