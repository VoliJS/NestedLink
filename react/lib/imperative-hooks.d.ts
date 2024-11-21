/**
 * Custom hook that forces a component to re-render.
 *
 * This hook returns a function that, when called, will trigger a re-render
 * of the component.
 *
 * @returns {() => void} A function that forces a re-render when invoked.
 */
export declare function useForceUpdate(): () => void;
export declare function useClass<T>(Class: new () => T): T;
export declare function useClass<T, A>(Class: new (a: A) => T, a: A): T;
export declare function useClass<T, A, B>(Class: new (a: A, b: B) => T, a: A, b: B): T;
/**
 * A custom hook that returns a ref object indicating whether the component is currently mounted.
 *
 * @returns {React.MutableRefObject<boolean>} A ref object with a boolean value that is `true` if the component is mounted, and `false` if it is unmounted.
 */
export declare function useIsMountedRef(): React.MutableRefObject<boolean>;
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
