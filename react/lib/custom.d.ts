import * as React from 'react';
import { PurePtr } from '@pure-ptr/core';
/**
 * A custom Radio component that renders a div with a specified class name and
 * an optional 'selected' class based on the `checkedPtr` value. When the div
 * is clicked, it sets the `checkedPtr` value to true.
 *
 * @param {string} [props.className='radio'] - The class name for the div.
 * @param {PurePtr<boolean>} props.checkedPtr - A pointer to a boolean value
 * indicating whether the radio is checked.
 * @param {React.ReactNode} props.children - The child elements to be rendered
 * inside the div.
 * @returns {JSX.Element} The rendered Radio component.
 */
export declare const Radio: ({ className, checkedPtr, children }: {
    checkedPtr: PurePtr<boolean>;
} & React.HTMLProps<HTMLDivElement>) => React.JSX.Element;
/**
 * A custom Checkbox component that renders a div element with a checkbox-like behavior.
 * The component uses a `PurePtr<boolean>` to manage its checked state.
 *
 * @param {string} [props.className='checkbox'] - The CSS class name to apply to the div element.
 * @param {PurePtr<boolean>} props.checkedPtr - A pointer to a boolean value that determines the checked state.
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the div element.
 *
 * @returns {JSX.Element} The rendered Checkbox component.
 */
export declare const Checkbox: ({ className, checkedPtr, children }: {
    checkedPtr: PurePtr<boolean>;
} & React.HTMLProps<HTMLDivElement>) => React.JSX.Element;
/**
 * An input element with a delayed update mechanism.
 *
 * @param {PurePtr<string>} props.valuePtr - A pointer to the value that the input element will display and update.
 * @param {number} [props.timeout=1000] - The delay in milliseconds before the input value is updated.
 *
 * @returns {JSX.Element} The rendered input element with delayed update functionality.
 */
export declare const DelayedInput: ({ valuePtr, timeout, ...props }: React.HTMLProps<HTMLInputElement> & {
    valuePtr: PurePtr<string>;
    timeout?: number;
}) => React.JSX.Element;
//# sourceMappingURL=custom.d.ts.map