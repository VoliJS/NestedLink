/**
 * Linked React components for building forms implementing React 0.14 valueLink semantic.
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */

import React from 'react'

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

export const Radio = ( { className = 'radio', checkedLink } ) => (
    <div className={ className + ( checkedLink.value ? ' selected' : '' ) }
         onClick={ checkedLink.action( () => true ) }
    />
);

/**
 * Simple custom <Checkbox /> tag implementation.
 * Takes any type of boolean link. Can be easily styled.
 *
 *     <Checkbox checkedLink={ boolLink } />
 */

export const Checkbox = ( { className = 'checkbox', checkedLink } ) => (
    <div className={ className + ( checkedLink.value ? ' selected' : '' ) }
         onClick={ checkedLink.action( x => !x ) }
    />
);