import { useState, useEffect } from 'react'
import { CustomLink, Link } from './link'

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

