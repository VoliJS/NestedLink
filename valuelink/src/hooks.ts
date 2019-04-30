import { useState, useEffect } from 'react'
import { CustomLink, Link } from './link'

/**
 * Create the linked local state.
 */
export function useLink<S>( initialState : S | (() => S) ){
    const [ value, set ] = useState( initialState );
    return new CustomLink( value, set );
}

export function useLinkedState<T extends Link<object>>
    ( links : { [ K in keyof T["value"] ] : Link<T["value"][K]> }, link : T ) : void {
    useEffect(()=>{
        Link.setValues( links, link.value );
    }, [ link.value ]);
}

