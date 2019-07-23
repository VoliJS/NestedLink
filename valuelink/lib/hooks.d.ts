/// <reference types="react" />
import { Link as StateRef, RefsHash } from './link';
export declare class UseStateRef<T> extends StateRef<T> {
    set(x: T | ((x: T) => T)): void;
    update(fun: (x: T, event?: Object) => T, event?: Object): void;
    constructor(value: T, set: (x: T | ((x: T) => T)) => void);
}
/**
 * Create the ref to the local state.
 */
export declare function useLink<S>(initialState: S | (() => S)): UseStateRef<S>;
export { useLink as useStateRef, useSafeLink as useSafeStateRef, useBoundLink as useBoundStateRef, useSafeBoundLink as useSafeBoundStateRef };
/**
 * Create the link to the local state which is safe to set when component is unmounted.
 * Use this for the state which is set when async I/O is completed.
 */
export declare function useSafeLink<S>(initialState: S | (() => S)): UseStateRef<S>;
/**
 * Returns the ref which is true when component it mounted.
 */
export declare function useIsMountedRef(): import("react").MutableRefObject<boolean>;
/**
 * Create the link to the local state which is bound to another
 * value or link in a single direction. When the source changes, the link changes too.
 */
export declare function useBoundLink<T>(source: T | StateRef<T>): StateRef<T>;
/**
 * Create the safe link to the local state which is synchronized with another
 * value or link in a single direction.
 * When the source change, the linked state changes too.
 */
export declare function useSafeBoundLink<T>(source: T | StateRef<T>): StateRef<T>;
/**
 * Persists links in local storage under the given key.
 * Links will be loaded on component's mount, and saved on unmount.
 * @param key - string key for the localStorage entry.
 * @param state - links to persist wrapped in an object `{ lnk1, lnk2, ... }`
 */
export declare function useLocalStorage(key: string, state: RefsHash): void;
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
export declare function useIO(fun: () => Promise<any>, condition?: any[]): boolean;
export declare function whenChanged(...objs: any[]): any[];
