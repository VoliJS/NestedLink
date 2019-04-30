import { useState, useEffect, useRef } from 'react'
import { CustomLink, Link, LinksHash } from './link'

/**
 * Create the linked local state.
 */
export function useLink<S>( initialState : S | (() => S) ){
    const [ value, set ] = useState( initialState );
    return new CustomLink<S>( value, set );
}

export function useLinkedState<T>( link : Link<T> ) : Link<T> {
    const localLink = useLink( link.value );

    useEffect(()=>{
        localLink.set( link.value );
    }, [ link.value ]);

    return localLink;
}

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
 * Wait for I/O completion
 * 
 * const isReady = useIO( () => model.fetch() );
 * 
 */
export function useIO( fun : () => Promise<any>, condition : any[] = [] ) : "ok" | "fail" {
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