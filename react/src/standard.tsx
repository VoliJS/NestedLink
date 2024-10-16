import * as React from 'react'
import { PurePtr } from '@pure-ptr/core'

/**
 * Wrapper for standard <input/> to be compliant with React 0.14 $value semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *      <input type="checkbox" $checked={ linkToBool } />
 *      <input type="radio"    $value={ linkToSelectedValue } value="option1value" />
 *      <input type="text"     $value={ linkToString } />
 */

function appendClass( classes: string, name: string ){
    return classes ? classes + ' ' + name : name;
}

interface ValidationProps {
    className?: string;
    requiredClass?: string;
    invalidClass?: string;
}

export function validationClasses(props: ValidationProps, value: any, error: any): string {
    const classes = props.className || '';
    
    if (!error) return classes;

    return appendClass(
        classes,
        value === '' ?
            props.requiredClass || 'required' : 
            props.invalidClass || 'invalid'
    );
}

export type InputProps = React.HTMLProps<HTMLInputElement> & ValidationProps & (
    { valuePtr : PurePtr<any> } | 
    { checkedPtr : PurePtr<boolean>}
)

export function Input( props : InputProps ) : JSX.Element {
        const { valuePtr, checkedPtr, ...rest } = props as any,
          type = props.type,
          ptr = valuePtr || checkedPtr;

    switch( type ){
        case 'checkbox':
            return <input {...rest}
                checked={ Boolean( ptr.value ) }
                onChange={ e => ptr.set( !ptr.value ) }/>

        case 'radio' :
            return <input {...rest}
                checked={ checkedPtr ? checkedPtr.value : valuePtr.value === props.value }
                onChange={ e => { e.target.checked && ( checkedPtr ? checkedPtr.set( true ) : ptr.set( props.value ) ) } }/>;

        default:
            return <input {...rest}
                className={ validationClasses( rest, valuePtr.value, valuePtr.error ) }
                value={ String( ptr.value ) }
                onChange={ e => ptr.set( e.target.value ) }/>
            }
};

/**
 * Wrapper for standard <textarea/> to be compliant with React 0.14 $value semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *     <TextArea $value={ linkToText } />
 */
export const TextArea = ( { valuePtr, ...props } : { valuePtr : PurePtr<string> } & ValidationProps & React.HTMLProps<HTMLTextAreaElement>) => (
    <textarea {...props}
        className={ validationClasses( props, valuePtr.value, valuePtr.error ) }
        value={ valuePtr.value }
        onChange={ e => valuePtr.set( e.target.value ) }/>
);

/**
 * Wrapper for standard <select/> to be compliant with React 0.14 $value semantic.
 * Regular <option/> tags must be used:
 *
 *     <Select $value={ linkToSelectedValue }>
 *         <option value="a">A</option>
 *         <option value="b">B</option>
 *     </Select>
 */
export const Select = ( { valuePtr, children, ...props } : { valuePtr : PurePtr<any> } & React.HTMLProps<HTMLSelectElement> ) => (
    <select {...props}
        value={ valuePtr.value }
        onChange={ e => valuePtr.set( e.target.value ) }>
        { children }
    </select>
);