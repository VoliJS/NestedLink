import React, { useRef, createContext, useEffect, useReducer, useState, useContext } from 'react';
import { Model, Store, Transactional, Collection } from 'type-r'

/**
 * Call on value change. Replaces props watchers.
 * @param value 
 * @param fun 
 */
export function useOnChange( value : any, action : ( prev :any ) => void ) : void {
    const prev = useRef( void 0 );

    if( value === prev.current ) return;
    
    if( value == null || prev.current == null ) action( prev.current );
    
    if( value instanceof Date && value.getTime() !== )
    ? value !== prev.current ){
        action( prev.current );
        prev.current = value;
    }
}

function idToken( x ){
    return x && x instanceof Date ? x.getTime() : x
}

export function useEvents( value : any, events : object ) : void {
    const context = useRef({});

    useEffect( () => {
        value && value.on( events, context.current );
        return () => value && value.off( events, context.current );
    }, [ value ]);
}

/**
 * Call on value change and deep change. Replaces props watchers.
 * @param value 
 * @param fun 
 */
export function useOnDeepChange( value : any, action : () => void ) : void {
    const prev = useRef( void 0 ),
        next = ( value && value._changeToken ) || value;

    if( next !== prev.current ){
        action();
        prev.current = next;
    }
}
