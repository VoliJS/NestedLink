/// <reference types="react" />
import { Linked } from '@linked/value';
declare class LinkedUseState<T> extends Linked<T> {
    set(x: T | ((x: T) => T)): void;
    update(fun: (x: T, event?: Object) => T, event?: Object): void;
    constructor(value: T, set: (x: T | ((x: T) => T)) => void);
}
/**
 * Create the ref to the local state.
 */
export declare function useLink<S>(initialState: S | (() => S)): LinkedUseState<S>;
export { useLink as useLinked, useSafeLink as useSafeLinked, useBoundLink as useSyncLinked, useSafeBoundLink as useSafeSyncLinked };
/**
 * Create the link to the local state which is safe to set when component is unmounted.
 * Use this for the state which is set when async I/O is completed.
 */
export declare function useSafeLink<S>(initialState: S | (() => S)): LinkedUseState<S>;
/**
 * Returns the ref which is true when component it mounted.
 */
export declare function useIsMountedRef(): import("react").MutableRefObject<boolean>;
/**
 * Create the link to the local state which is bound to another
 * value or link in a single direction. When the source changes, the link changes too.
 */
export declare function useBoundLink<T>(source: T | Linked<T>): Linked<T>;
/**
 * Create the safe link to the local state which is synchronized with another
 * value or link in a single direction.
 * When the source change, the linked state changes too.
 */
export declare function useSafeBoundLink<T>(source: T | Linked<T>): Linked<T>;
/**
 * Persists links in local storage under the given key.
 * Links will be loaded on component's mount, and saved on unmount.
 * @param key - string key for the localStorage entry.
 * @param state - links to persist wrapped in an object `{ lnk1, lnk2, ... }`
 */
export declare function useLocalStorage(key: string, state: Linked.Hash): void;
/**
 * Wait for the promise (or async function) completion.
 * Execute operation once when mounted, returning:
 * - `false` while the I/O operation is pending;
 * - `true` if I/O is complete without exception;
 * - `exception` object if I/O promise failed.
 *
 * const isReady = useIO( async () => {
 *      const data = await fetchData();
 *      link.set( data );
 * });
 */
export declare function useIO(fun: () => Promise<any>, condition?: any[]): boolean | any;
export declare function whenChanged(...objs: any[]): any[];
