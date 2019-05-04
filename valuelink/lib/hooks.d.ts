import { CustomLink, Link, LinksHash } from './link';
/**
 * Create the link to the local state.
 */
export declare function useLink<S>(initialState: S | (() => S)): CustomLink<S>;
/**
 * Create the link to the local state which is safe to set when component is unmounted.
 * Use this for the state which is set asycnhronously, as when I/O is completed.
 */
export declare function useSafeLink<S>(initialState: S | (() => S)): Link<S>;
/**
 * Create the link to the local state which is synchronized with another link
 * in one direction. When the link change, the linked state changes too.
 */
export declare function useLinkedState<T>(link: Link<T>): Link<T>;
/**
 * Persists links in local storage under the given key.
 * Links will be loaded on component's mount, and saved on unmount.
 * @param key - string key for the localStorage entry.
 * @param state - links to persist wrapped in an object `{ lnk1, lnk2, ... }`
 */
export declare function useLocalStorage(key: string, state: LinksHash): void;
export declare function useIO(fun: () => Promise<any>, condition?: any[]): boolean;
