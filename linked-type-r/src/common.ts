import { createContext, useContext, useReducer } from 'react';

export const StoreContext = createContext( null );

// Get store.
export function useStore(){
    return useContext( StoreContext );
}

// forceUpdate hook.
const MAX_INTEGER = 2^24;

function counter( x : number ){
    return x - 1 || MAX_INTEGER;
} 

export function useForceUpdate() : () => void {
    return useReducer( counter, MAX_INTEGER )[ 1 ] as any;
}