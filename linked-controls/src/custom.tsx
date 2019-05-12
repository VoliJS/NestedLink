import * as React from 'react'
import { Link, useBoundLink } from 'valuelink'
import { useThrottle } from './hooks'
import { string } from 'prop-types';

/**
 * Simple custom <Radio/> tag implementation. Can be easily styled.
 * Intended to be used with offhand bool link:
 *
 *    <Radio $checked={ linkToValue.equals( optionValue ) />
 */
export const Radio = ( { className = 'radio', $checked, children } : { $checked : Link<boolean> } & React.HTMLProps<HTMLDivElement> ) => (
    <div className={ className + ( $checked.value ? ' selected' : '' ) }
         onClick={ $checked.action( () => true ) }
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
export const Checkbox = ( { className = 'checkbox', $checked, children } : { $checked : Link<boolean> } & React.HTMLProps<HTMLDivElement> ) => (
    <div className={ className + ( $checked.value ? ' selected' : '' ) }
         onClick={ $checked.action( x => !x ) }
    >
        { children }
    </div>
);

export const DelayedInput = ({ $value, timeout = 1000, ...props }) => {
    const $inputValue = useBoundLink( $value as Link<string> )
        .onChange(
            useThrottle(
                x => $value.set( x ),
                timeout,
                [ $value.value ]
            )
        );
    
    return <input {...$inputValue.props} {...props}/>;
}