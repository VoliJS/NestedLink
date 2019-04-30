import { CustomLink, Link, LinksHash } from './link';
/**
 * Create the linked local state.
 */
export declare function useLink<S>(initialState: S | (() => S)): CustomLink<S>;
export declare function useLinkedState<T>(link: Link<T>): Link<T>;
export declare function useLocalStorage(key: string, state: LinksHash): void;
