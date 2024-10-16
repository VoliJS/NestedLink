import * as React from 'react'
import { PurePtr } from '@pure-ptr/core'
import { useLinkedStatePtr } from './hooks';
import { useThrottle } from './hooks'

/**
 * Simple custom <Radio/> tag implementation. Can be easily styled.
 * Intended to be used with offhand bool link:
 *
 *    <Radio $checked={ linkToValue.equals( optionValue ) />
 */
export const Radio = ( { className = 'radio', checkedPtr, children } : { checkedPtr : PurePtr<boolean> } & React.HTMLProps<HTMLDivElement> ) => (
    <div className={ className + ( checkedPtr.value ? ' selected' : '' ) }
         onClick={ () => checkedPtr.set( true ) }
    >
        { children }
    </div>
);

/**
 * Simple custom <Checkbox /> tag implementation.
 * Takes any type of boolean link. Can be easily styled.
 *
 *     <Checkbox $checked={ boolLink } />
 */
export const Checkbox = ( { className = 'checkbox', checkedPtr, children } : { checkedPtr : PurePtr<boolean> } & React.HTMLProps<HTMLDivElement> ) => (
    <div className={ className + ( checkedPtr.value ? ' selected' : '' ) }
         onClick={ () => checkedPtr.update( x => !x ) }
    >
        { children }
    </div>
);

export const DelayedInput = ({ valuePtr, timeout = 1000, ...props } : React.HTMLProps<HTMLInputElement> & {
    valuePtr : PurePtr<string>,
    timeout? : number
}) => {
    const delayedUpdate = useThrottle(
        x => valuePtr.set( x ),
        timeout,
        [ valuePtr.value ]
    );

    const statePtr = useLinkedStatePtr( valuePtr )
        .onChange( delayedUpdate );
    
    return <input {...statePtr.props} {...props} />;
}