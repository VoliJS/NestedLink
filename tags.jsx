/**
 * Linked React components for building forms implementing React 0.14 valueLink semantic.
 *
 * WTFPL License, (c) 2016 Vlad Balin, Volicon.
 */

import React, { PropTypes } from 'react'

const setValue     = ( x, e ) => e.target.value;
const setBoolValue = ( x, e ) => Boolean( e.target.checked );

/**
 * Wrapper for standard <input/> to be compliant with React 0.14 valueLink semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *      <input type="checkbox" checkedLink={ linkToBool } />
 *      <input type="radio"    valueLink={ linkToSelectedValue } value="option1value" />
 *      <input type="text"     valueLink={ linkToString } />
 */

export const Input = ( { invalid = 'invalid', className = '', valueLink, checkedLink, ...props } ) =>{
    const type = props.type,
          link = valueLink || checkedLink;

    switch( type ){
        case 'checkbox':
            return <input {...props}
                className={ className }
                checked={ link.value }
                onChange={ link.action( setBoolValue ) }/>;

        case 'radio' :
            return <input {...props}
                className={ className }
                checked={ link.value === props.value }
                onChange={ e => { e.target.checked && link.set( props.value ) } }/>;

        default:
            return <input {...props}
                className={ valueLink.error ? invalid + ' ' + className : className }
                value={ valueLink.value }
                onChange={ valueLink.action( setValue ) }/>;
    }
};

export const isRequired = x => x != null && x !== '';

const emailPattern   = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
export const isEmail = x => x.match( emailPattern );

// This number component rejects invalid input and modify link only with valid number values.
// Implementing numeric input rejection might be tricky.
export const NumberInput = React.createClass( {
    propTypes : {
        positive  : PropTypes.bool,
        integer   : PropTypes.bool,
        valueLink : PropTypes.object
    },

    componentWillMount(){
        // Initialize component state
        this.setAndConvert( this.props.valueLink.value );
    },

    setValue( x ){
        // We're not using native state in order to avoid race condition.
        this.value = String( x );
        this.error = isNaN( Number( x ) );
        this.forceUpdate();
    },

    setAndConvert( x ){
        let value = Number( x );

        if( this.props.positive ){
            value = Math.abs( x );
        }

        if( this.props.integer ){
            value = Math.round( value );
        }

        this.setValue( value );
    },

    componentWillReceiveProps( nextProps ){
        const { valueLink : next } = nextProps;

        if( Number( next.value ) !== Number( this.value ) ){
            this.setAndConvert( next.value ); // keep state being synced
        }
    },

    render(){
        const { type, invalid = 'invalid', className = '', valueLink, ...props } = this.props,
              error = valueLink.error || this.error;

        return <input type="text"
                      className={ error ? className + ' ' + invalid : className }
                      value={ this.value }
                      onKeyPress={ this.onKeyPress }
                      onChange={ this.onChange }
            { ...props }
        />;
    },

    onKeyPress( e ){
        const { charCode } = e,
              { integer, positive } = this.props,
              allowed = ( positive ? [] : [ 45 ]).concat( integer ? [] : [ 46 ] );

        if( e.ctrlKey ) return;

        if( charCode && // allow control characters
            ( charCode < 48 || charCode > 57 ) && // char is number
            allowed.indexOf( charCode ) < 0 ){ // allowed char codes
            e.preventDefault();
        }
    },

    onChange( e ){
        // Update local state...
        const { value } = e.target;
        this.setValue( value );

        const asNumber = Number( value );

        if( value && !isNaN( asNumber ) ){
            this.props.valueLink.update( x =>{
                // Update link if value is changed
                if( asNumber !== Number( x ) ){
                    return asNumber;
                }
            } );
        }
    }
} );

/**
 * Wrapper for standard <textarea/> to be compliant with React 0.14 valueLink semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *     <TextArea valueLink={ linkToText } />
 */
export const TextArea = ( { invalid = 'invalid', className = '', valueLink, ...props } ) => (
    <textarea {...props}
        className={ valueLink.error ? invalid + ' ' + className : className }
        value={ valueLink.value }
        onChange={ valueLink.action( setValue ) }/>
);

/**
 * Wrapper for standard <select/> to be compliant with React 0.14 valueLink semantic.
 * Regular <option/> tags must be used:
 *
 *     <Select valueLink={ linkToSelectedValue }>
 *         <option value="a">A</option>
 *         <option value="b">B</option>
 *     </Select>
 */
export const Select = ( { valueLink, children, ...props } ) => (
    <select {...props}
        value={ valueLink.value }
        onChange={ valueLink.action( setValue ) }>
        { children }
    </select>
);

/**
 * Simple custom <Radio/> tag implementation. Can be easily styled.
 * Intended to be used with offhand bool link:
 *
 *    <Radio checkedLink={ linkToValue.equals( optionValue ) />
 */

export const Radio = ( { className = 'radio', checkedLink, children } ) => (
    <div className={ className + ( checkedLink.value ? ' selected' : '' ) }
         onClick={ checkedLink.action( () => true ) }
    >
        { children }
    </div>
);

/**
 * Simple custom <Checkbox /> tag implementation.
 * Takes any type of boolean link. Can be easily styled.
 *
 *     <Checkbox checkedLink={ boolLink } />
 */

export const Checkbox = ( { className = 'checkbox', checkedLink, children } ) => (
    <div className={ className + ( checkedLink.value ? ' selected' : '' ) }
         onClick={ checkedLink.action( x => !x ) }
    >
        { children }
    </div>
);
