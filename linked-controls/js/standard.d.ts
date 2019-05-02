import * as React from 'react';
import { Link } from 'valuelink';
export declare function validationClasses(props: any, value: any, error: any): any;
export interface InputProps extends React.HTMLProps<HTMLInputElement> {
    $value?: Link<any>;
    $checked?: Link<boolean>;
    value?: any;
}
export declare function Input(props: InputProps): JSX.Element;
/**
 * Wrapper for standard <textarea/> to be compliant with React 0.14 $value semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *     <TextArea $value={ linkToText } />
 */
export declare const TextArea: ({ $value, ...props }: {
    $value: Link<string>;
} & React.HTMLProps<HTMLTextAreaElement>) => JSX.Element;
/**
 * Wrapper for standard <select/> to be compliant with React 0.14 $value semantic.
 * Regular <option/> tags must be used:
 *
 *     <Select $value={ linkToSelectedValue }>
 *         <option value="a">A</option>
 *         <option value="b">B</option>
 *     </Select>
 */
export declare const Select: ({ $value, children, ...props }: {
    $value: Link<any>;
} & React.HTMLProps<HTMLSelectElement>) => JSX.Element;
