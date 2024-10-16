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
export declare function Input(props: InputProps): JSX.Element;
/**
 * Wrapper for standard <textarea/> to be compliant with React 0.14 $value semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *     <TextArea $value={ linkToText } />
 */
export declare const TextArea: ({ valuePtr, ...props }: {
    valuePtr: PurePtr<string>;
} & ValidationProps & React.HTMLProps<HTMLTextAreaElement>) => React.JSX.Element;
/**
 * Wrapper for standard <select/> to be compliant with React 0.14 $value semantic.
 * Regular <option/> tags must be used:
 *
 *     <Select $value={ linkToSelectedValue }>
 *         <option value="a">A</option>
 *         <option value="b">B</option>
 *     </Select>
 */
export declare const Select: ({ valuePtr, children, ...props }: {
    valuePtr: PurePtr<any>;
} & React.HTMLProps<HTMLSelectElement>) => React.JSX.Element;
export {};
