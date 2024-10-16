import * as React from 'react';
import { PurePtr } from '@pure-ptr/core';
/**
 * Simple custom <Radio/> tag implementation. Can be easily styled.
 * Intended to be used with offhand bool link:
 *
 *    <Radio $checked={ linkToValue.equals( optionValue ) />
 */
export declare const Radio: ({ className, checkedPtr, children }: {
    checkedPtr: PurePtr<boolean>;
} & React.HTMLProps<HTMLDivElement>) => React.JSX.Element;
/**
 * Simple custom <Checkbox /> tag implementation.
 * Takes any type of boolean link. Can be easily styled.
 *
 *     <Checkbox $checked={ boolLink } />
 */
export declare const Checkbox: ({ className, checkedPtr, children }: {
    checkedPtr: PurePtr<boolean>;
} & React.HTMLProps<HTMLDivElement>) => React.JSX.Element;
export declare const DelayedInput: ({ valuePtr, timeout, ...props }: React.HTMLProps<HTMLInputElement> & {
    valuePtr: PurePtr<string>;
    timeout?: number;
}) => React.JSX.Element;
