import * as React from 'react'
import { PurePtr } from '@pure-ptr/core'

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

export type InputProps = React.HTMLProps<HTMLInputElement> & ValidationProps &
    { valuePtr? : PurePtr<any>, checkedPtr? : PurePtr<boolean> }

/**
 * A custom input component that binds its value to a `PurePtr` object.
 * 
 * @param {PurePtr<any>} props.valuePtr - A pointer object that holds the value of the input element.
 * @param {PurePtr<boolean>} props.checkedPtr - A pointer object that holds the checked state of the input element.
 * @returns {JSX.Element} The rendered input element.
 * 
 * @example
 *    <Input valuePtr={ textValuePtr }/>
 *    <Input type="checkbox" checkedPtr={ checkedValuePtr }/>
 */
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
 * A custom textarea component that binds its value to a `PurePtr` object.
 * 
 * @param {PurePtr<string>} props.valuePtr - A pointer object that holds the value of the textarea element.
 * @returns {JSX.Element} The rendered textarea element.
 * 
 * @example
 *    <TextArea valuePtr={ textValuePtr }/>
 */
export const TextArea = ( { valuePtr, ...props } : { valuePtr : PurePtr<string> } & ValidationProps & React.HTMLProps<HTMLTextAreaElement>) => (
    <textarea {...props}
        className={ validationClasses( props, valuePtr.value, valuePtr.error ) }
        value={ valuePtr.value }
        onChange={ e => valuePtr.set( e.target.value ) }/>
);

/**
 * A custom select component that binds its value to a `PurePtr` object.
 * 
 * @param {PurePtr<any>} props.valuePtr - A pointer object that holds the value of the select element.
 * @returns {JSX.Element} The rendered select element.
 * 
 * @example
 *    <Select valuePtr={ selectedValuePtr }>
 *         <option value="option1value">Option 1</option>
*          <option value="option2value">Option 2</option>
 *   </Select>
 */
export const Select = ( { valuePtr, children, ...props } : { valuePtr : PurePtr<any> } & React.HTMLProps<HTMLSelectElement> ): JSX.Element => (
    <select {...props}
        value={ valuePtr.value }
        onChange={ e => valuePtr.set( e.target.value ) }>
        { children }
    </select>
);