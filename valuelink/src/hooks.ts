import { useState, useEffect, useRef } from 'react'
import { CustomLink, Link, LinksHash } from './link'

/**
 * Create the link to the local state.
 */
export function useLink<S>( initialState : S | (() => S) ){
    const [ value, set ] = useState( initialState );
    return new CustomLink<S>( value, set );
}

/**
 * Create the link to the local state which is synchronized with another link
 * in one direction. When the link change, the linked state changes too.
 */
export function useLinkedState<T>( link : Link<T> ) : Link<T> {
    const localLink = useLink( link.value );

    useEffect(()=>{
        localLink.set( link.value );
    }, [ link.value ]);

    return localLink;
}

/**
 * Persists links in local storage under the given key. 
 * Links will be loaded on component's mount, and saved on unmount.
 * @param key - string key for the localStorage entry.
 * @param state - links to persist wrapped in an object `{ lnk1, lnk2, ... }`
 */
export function useLocalStorage( key : string, state : LinksHash ){
    // save state to use on unmount...
    const stateRef = useRef<LinksHash>();
    stateRef.current = state;

    useEffect(()=>{
        const savedData = JSON.parse( localStorage.getItem( 'todos' ) || '{}' );
        Link.setValues( stateRef.current, savedData );

        return () =>{
            const dataToSave = Link.getValues( stateRef.current );
            localStorage.setItem( key, JSON.stringify( dataToSave ) );
        }
    },[]);
}

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
export function useIO( fun : () => Promise<any>, condition : any[] = [] ) : null | "ok" | "fail" {
    // save state to use on unmount...
    const [ isReady, setIsReady ] = useState( null );

    useEffect(()=>{
        fun()
            .then(() => setIsReady( "ok" ) )
            .catch(() => setIsReady( "fail" ) );
        
        return () =>{
            setIsReady( null );
        }
    }, condition);

    return isReady;
}