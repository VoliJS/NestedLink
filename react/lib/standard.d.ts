import * as React from 'react';
import { PurePtr } from '@pure-ptr/core';
interface ValidationProps {
    className?: string;
    requiredClass?: string;
    invalidClass?: string;
}
export declare function validationClasses(props: ValidationProps, value: any, error: any): string;
export type InputProps = React.HTMLProps<HTMLInputElement> & ValidationProps & ({
    valuePtr: PurePtr<any>;
} | {
    checkedPtr: PurePtr<boolean>;
});
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
export declare function Input(props: InputProps): JSX.Element;
/**
 * A custom textarea component that binds its value to a `PurePtr` object.
 *
 * @param {PurePtr<string>} props.valuePtr - A pointer object that holds the value of the textarea element.
 * @returns {JSX.Element} The rendered textarea element.
 *
 * @example
 *    <TextArea valuePtr={ textValuePtr }/>
 */
export declare const TextArea: ({ valuePtr, ...props }: {
    valuePtr: PurePtr<string>;
} & ValidationProps & React.HTMLProps<HTMLTextAreaElement>) => React.JSX.Element;
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
export declare const Select: ({ valuePtr, children, ...props }: {
    valuePtr: PurePtr<any>;
} & React.HTMLProps<HTMLSelectElement>) => JSX.Element;
export {};
