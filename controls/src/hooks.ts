import { useRef, useEffect } from 'react'

// Delays function calls for a given timeout.
export function useThrottle<F extends (...args) => void>( fun : F, timeout : number, changes = [] ) : F {
    // Create the ref to store timer.
    const timer = useRef( null );

    function cancel(){
        if( timer.current ){
            clearTimeout( timer.current );
            timer.current = null;
        }
    }

    // Register the 
    useEffect( () => cancel, changes );

    return function( ...args : any[] ){
        cancel();

        timer.current = setTimeout(()=>{
            timer.current = null;
            fun.apply( this, args );
        }, timeout );
    } as F
}