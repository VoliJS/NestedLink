import { PurePtr } from '@pure-ptr/core';
/**
 * Create a pointer to a local component state.
 *
 * @param {S | (() => S)} initialState - The initial state value or a function that returns the initial state.
 * @returns {PurePtr<S>} PurePtr containing the state value and the state setter function.
 */
export declare function useStatePtr<S>(initialState: S | (() => S)): PurePtr<S>;
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
//# sourceMappingURL=state-hooks.d.ts.map