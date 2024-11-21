import { DependencyList, useEffect, useRef, useState } from "react";

/**
 * Custom hook that forces a component to re-render.
 *
 * This hook returns a function that, when called, will trigger a re-render
 * of the component.
 *
 * @returns {() => void} A function that forces a re-render when invoked.
 */
export function useForceUpdate(): () => void {
    const [, setForceRender] = useState<Symbol|null>( null ); // Symbol state to force re-render
    
    return () => setForceRender( Symbol() );
}

export function useClass<T>( Class: new () => T ) : T;
export function useClass<T, A>( Class: new ( a : A ) => T, a : A ) : T;
export function useClass<T, A, B>( Class: new ( a : A, b : B ) => T, a : A, b : B ) : T;
/**
 * A custom hook that creates and returns an instance of a given class.
 * The instance is created only once and is memoized for the lifetime of the component.
 *
 * @template T - The type of the class instance.
 * @param Class - The class constructor to instantiate.
 * @param a - Optional first argument to pass to the class constructor.
 * @param b - Optional second argument to pass to the class constructor.
 * @returns The instance of the class.
 */
export function useClass<T>( Class: new ( a?: any, b?: any ) => T, a? : any, b?: any) {
    const ref = useRef<T>();

    if( !ref.current ){
        ref.current = 
            b !== undefined ? new Class( a, b) :
            a !== undefined ? new Class( a ) :
            new Class();
    }

    return ref.current;
}

/**
 * A custom hook that returns a ref object indicating whether the component is currently mounted.
 * 
 * @returns {React.MutableRefObject<boolean>} A ref object with a boolean value that is `true` if the component is mounted, and `false` if it is unmounted.
 */
export function useIsMountedRef(): React.MutableRefObject<boolean>{
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
 * A custom hook that throttles the execution of a function.
 * 
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