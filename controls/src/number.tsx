import * as React from 'react'
import { Link } from '@linked/react'
import { validationClasses } from './standard'
import { isNumber } from './validators'
import { useState, useEffect } from 'react'

// This number component rejects invalid input and modify link only with valid number values.
// Implementing numeric input rejection might be tricky.
export interface NumberInputProps extends React.HTMLProps<HTMLInputElement>{
    positive?  : boolean,
    integer?   : boolean,
    $value? : Link<number>
}

export const NumberInput = ( props : NumberInputProps ) => {
    const { positive, integer, $value, value, onChange, ...rest } = props,
        [ asText, setAsText ] = useState( '' ),
        error = asText === '' || !isNumber( asText );

    useEffect( () => {
        if( Number( asText ) !== Number( $value.value ) ){
            setAsText( String( toNumber( $value.value, props ) ) );
        }
    }, [ $value.value ]);

    const onKeyPress = e =>{
        const { charCode } = e,
              allowed = ( positive ? [] : [ 45 ]).concat( integer ? [] : [ 46 ] );
    
        if( e.ctrlKey ) return;
    
        if( charCode && // allow control characters
            ( charCode < 48 || charCode > 57 ) && // char is number
            allowed.indexOf( charCode ) < 0 ){ // allowed char codes
            e.preventDefault();
        }
    };

    const onChangeHandler = e => {
        // Update local state...
        const { value } = e.target;
        setAsText( value );
    
        const asNumber = toNumber( value, props );
    
        if( value && !isNaN( asNumber ) ){
            $value && $value.update( x => {
                // Update link if value is changed
                if( asNumber !== Number( x ) ){
                    return asNumber;
                }
            } );
        }
    }

    return <input { ...rest }
                  type="text"
                  className={ validationClasses( props, this.value, error ) }
                  value={ this.value }
                  onKeyPress={ onKeyPress }
                  onChange={ onChangeHandler }
    />;
}

function toNumber( x : any, props ){
    let value = Number( x );

    if( props.positive ){
        value = Math.abs( x );
    }

    if( props.integer ){
        value = Math.round( value );
    }

    return value;
}