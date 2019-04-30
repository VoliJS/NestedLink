import { CustomLink, Link, LinksHash } from './link';
/**
 * Create the link to the local state.
 */
export declare function useLink<S>(initialState: S | (() => S)): CustomLink<S>;
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
export declare function useIO(fun: () => Promise<any>, condition?: any[]): null | "ok" | "fail";
