import { helpers, PureObject, PurePtr } from '@pure-ptr/core';
import { useEffect, useState } from 'react';

class UseStatePtr<T> extends PurePtr<T> {
    // Set the component's state value.
    set( x : T | ( ( x : T ) => T ) ) : void {}

    update( fun : ( x : T, event? : Object ) => T, event? : Object ) : void {
        // update function must be overriden to use state set
        // ability to delay an update, and to preserve ptr.update semantic.
        this.set( x => {
            const result = fun( x, event );
            return result === void 0 ? x : result;
        });
    }

    constructor(
        value : T,
        set : ( x : T | ( ( x : T ) => T ) ) => void
    ){
        super( value );
        this.set = set;
    }
}

/**
 * Create a pointer to a local component state.
 * 
 * @param {S | (() => S)} initialState - The initial state value or a function that returns the initial state.
 * @returns {PurePtr<S>} PurePtr containing the state value and the state setter function.
 */
export function useStatePtr<S>( initialState : S | (() => S) ) : PurePtr<S> {
    const [ value, set ] = useState( initialState );
    return new UseStatePtr( value, set );
}

/**
 * Use immutable class instance as local component state.
 *
 * @template C - The type of the immutable class.
 * @param ImmutableClass - The constructor of the immutable class.
 * @returns A `PurePtr` instance that contains the state and a setter function.
 */
export function useClassPtr<C extends PureObject>( ImmutableClass : new () => C ) : PurePtr<C> {
    const [ value, set ] = useState( () => {
        const state = new ImmutableClass();
        state.initialize();
        return state;
    } );

    return new UseStatePtr( value, set );
}

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
export function useLinkedStatePtr<T>(source: T | PurePtr<T>): PurePtr<T> {
    const value = source instanceof PurePtr ? source.value : source,
          link = useStatePtr(value);

    useEffect(() => link.set(value), [value]);

    return link;
}

function getInitialState<S>( initialState : S | (() => S)) : S {
    return typeof initialState === 'function' ? (initialState as any)() : initialState;
}

/**
 * Create a pointer to a local storage.
 *
 * @param {string} key - The key under which the state is stored in session storage.
 * @param {S | (() => S)} initialState - The initial state or a function that returns the initial state.
 * @returns {ReturnType<typeof useStatePtr<S>>} A state pointer that is synchronized with session storage.
 */
export function useLocalStoragePtr<S>( key : string, initialState : S | (() => S) ) : PurePtr<S> {
    const valuePtr = useStatePtr<S>( () =>
        JSON.parse( localStorage.getItem( key ) || 'null' ) || getInitialState( initialState )
    );

    return valuePtr.onChange( x => {
        localStorage.setItem( key, JSON.stringify( x ) );
    })
}

/**
 * Create a pointer to a session storage.
 *
 * @param {string} key - The key under which the state is stored in session storage.
 * @param {S | (() => S)} initialState - The initial state or a function that returns the initial state.
 * @returns {ReturnType<typeof useStatePtr<S>>} A state pointer that is synchronized with session storage.
 */
export function useSessionStoragePtr<S>( key : string, initialState : S | (() => S) )  : PurePtr<S> {
    const valuePtr = useStatePtr<S>( () =>
        JSON.parse( sessionStorage.getItem( key ) || 'null' ) || getInitialState( initialState )
    );

    return valuePtr.onChange( x => {
        sessionStorage.setItem( key, JSON.stringify( x ) );
    })
}