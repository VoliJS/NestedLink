import * as React from 'react'
import { Link } from 'valuelink'

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

function appendClass( classes, name ){
    return classes ? classes + ' ' + name : name;
}

export function validationClasses( props, value, error ){
    const classes = props.className || '';
    
    if( !error ) return classes;

    return appendClass(
        classes,
        value === '' ?
            props.requiredClass || 'required' : 
            props.invalidClass || 'invalid'
    )
}

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
    valueLink? : Link<any>
    checkedLink? : Link<boolean>
    value? : any
}

export function Input( props : InputProps ) : JSX.Element;

export function Input( props ){
        const { valueLink, checkedLink, ...rest } = props,
          type = props.type,
          link = valueLink || checkedLink;

    switch( type ){
        case 'checkbox':
            return <input {...rest}
                checked={ Boolean( link.value ) }
                onChange={ link.action( setBoolValue ) }/>;

        case 'radio' :
            return <input {...rest}
                checked={ link.value === props.value }
                onChange={ e => { e.target.checked && link.set( props.value ) } }/>;

        default:
            return <input {...rest}
                className={ validationClasses( rest, valueLink.value, valueLink.error ) }
                value={ String( valueLink.value ) }
                onChange={ valueLink.action( setValue ) }/>;
    }
};

/**
 * Wrapper for standard <textarea/> to be compliant with React 0.14 valueLink semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *     <TextArea valueLink={ linkToText } />
 */
export const TextArea = ( { valueLink, ...props } : { valueLink : Link<string> } & React.HTMLProps<HTMLTextAreaElement>) => (
    <textarea {...props}
        className={ validationClasses( props, valueLink.value , valueLink.error ) }
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
export const Select = ( { valueLink, children, ...props } : { valueLink : Link<any> } & React.HTMLProps<HTMLSelectElement> ) => (
    <select {...props}
        value={ valueLink.value }
        onChange={ valueLink.action( setValue ) }>
        { children }
    </select>
);