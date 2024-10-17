import { helpers, PurePtr } from '@pure-ptr/core';
import { useEffect, useRef, useState } from 'react';

class UseStatePtr<T> extends PurePtr<T> {
    // Set the component's state value.
    set( x : T | ( ( x : T ) => T ) ) : void {}

    update( fun : ( x : T, event? : Object ) => T, event? : Object ) : void {
        // update function must be overriden to use state set
        // ability to delay an update, and to preserve link.update semantic.
        this.set( x => {
            const value = helpers( x ).clone( x ),
                result = fun( value, event );

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
 * Create the ref to the local state.
 */
export function useStatePtr<S>( initialState : S | (() => S) ){
    const [ value, set ] = useState( initialState );
    return new UseStatePtr( value, set );
}

/**
 * Returns the ref which is true when component it mounted.
 */
export function useIsMountedRef(){
    const isMounted = useRef( true );
    
    useEffect( () => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        }
    }, []);

    return isMounted;
}

/**
 * Create a pointer to the local state that is synchronized with another 
 * value or pointer in a single direction. When the source changes, the linked state changes too.
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

export function useLocalStoragePtr<S>( key : string, initialState : S | (() => S) ){
    const [ value, setValue ] = useState<S>( () =>
        JSON.parse( localStorage.getItem( key ) || 'null' ) || getInitialState( initialState )
    );

    return new UseStatePtr( value, x => {
        localStorage.setItem( key, JSON.stringify( x ) );
        setValue( x );
    })
}

export function useSessionStoragePtr<S>( key : string, initialState : S | (() => S) ){
    const [ value, setValue ] = useState<S>( () =>
        JSON.parse( sessionStorage.getItem( key ) || 'null' ) || getInitialState( initialState )
    );

    return new UseStatePtr( value, x => {
        sessionStorage.setItem( key, JSON.stringify( x ) );
        setValue( x );
    })
}

/**
 * Custom hook to handle asynchronous operations with support for cancellation and component unmounting.
 *
 * @template T - The type of the result returned by the asynchronous function.
 * @param {function(AbortSignal): Promise<T>} fun - The asynchronous function to execute. It receives an AbortController to handle cancellation.
 * @param {any[]} [condition=[]] - An array of dependencies that will trigger the effect when changed.
 * @returns {object} - An object containing:
 *   - `isReady` (boolean): Indicates if the operation is complete.
 *   - `result` (T | null): The result of the asynchronous operation.
 *   - `error` (any): The error encountered during the operation, if any.
 *   - `hasBeenRefreshed` (boolean): Indicates if the operation has been refreshed at least once.
 *   - `refresh` (function): A function to re-trigger the asynchronous operation.
 */
export function useIO<T>( fun : ( signal : AbortSignal ) => Promise<T>, condition : any[] = [] ): { 
    isReady: boolean; 
    result: T | null; 
    error: any;
    hasBeenRefreshed: boolean;
    refresh: () => void; 
} {
    const [state, setState] = useState( () =>({
        isPending: 0,
        result: null as T | null,
        error: null,
        timestamp: 0
    }));

    // Ref to track if the component is mounted
    const isMountedRef = useIsMountedRef();

    // Ref to hold the latest AbortController
    const abortControllerRef = useRef<AbortController|null>(null);

    useEffect(()=>{
        abortControllerRef.current = new AbortController();

        fun( abortControllerRef.current.signal )
            .then( result => {
                if( isMountedRef.current ){
                    setState( state => ({
                        isPending: state.isPending - 1,
                        result,
                        error: null,
                        timestamp: state.timestamp
                    }));
                }
            })
            .catch( error => {
                if( isMountedRef.current ){
                    setState( state => ({
                        isPending: state.isPending - 1,
                        result: null,
                        error : error.name !== 'AbortError' ? error : null,
                        timestamp: state.timestamp
                    }));
                }
            })
            .finally( () => {
                if( isMountedRef.current ){
                    abortControllerRef.current = null;
                }
            })

        // function in set instead of value to avoid race conditions with counter increment.
        setState( 
            state => ({
                isPending: state.isPending + 1,
                result: null,
                error: null,
                timestamp: state.timestamp
            })
        );

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        }
    }, [ ...condition, state.timestamp ]);

    return {
        isReady : !state.isPending,
        hasBeenRefreshed : state.timestamp > 0,
        result : state.result,
        error : state.error,
        refresh : () => state.isPending || setState( state => ({ ...state, timestamp: Date.now() }) )
    }
}

/**
 * A custom hook that throttles the execution of a function.
 * 
 * @template F - The type of the function to be throttled.
 * @param {F} fun - The function to be throttled.
 * @param {number} timeout - The delay in milliseconds for the throttle.
 * @param {Array<any>} [changes=[]] - The list of dependencies that will trigger the effect.
 * @returns {F} - The throttled function.
 * 
 * @example
 * ```typescript
 * const throttledFunction = useThrottle(myFunction, 1000, [dependency]);
 * ```
 */
export function useThrottle<F extends (...args: any) => void>( fun : F, timeout : number, changes : any[] = [] ) : F {
    // Create the ref to store timer.
    const timer = useRef<number | null>(null);

    function cancel(){
        if( timer.current ){
            clearTimeout( timer.current );
            timer.current = null;
        }
    }

    useEffect( () => cancel, changes );

    return function( ...args : any[] ){
        cancel();

        timer.current = setTimeout(()=>{
            timer.current = null;
            fun.apply( null, args );
        }, timeout );
    } as F
}

/**
 * React Hook to execute a function on a timer interval.
 *
 * @param {function} fun - The function to execute on each interval.
 * @param {number} interval - The interval duration in milliseconds.
 * @param {any[]} [deps=[]] - An array of dependencies that will trigger the effect when changed.
 */
export function useInterval(fun: () => void, interval: number, deps: any[] = []): void {
    useEffect(() => {
        const id = setInterval(fun, interval);
        return () => clearInterval(id);
    }, [interval, ...deps]);
}