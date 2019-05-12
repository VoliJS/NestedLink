import * as React from 'react';
import { Link } from 'valuelink';
/**
 * Simple custom <Radio/> tag implementation. Can be easily styled.
 * Intended to be used with offhand bool link:
 *
 *    <Radio $checked={ linkToValue.equals( optionValue ) />
 */
export declare const Radio: ({ className, $checked, children }: {
    $checked: Link<boolean>;
} & React.HTMLProps<HTMLDivElement>) => JSX.Element;
/**
 * Simple custom <Checkbox /> tag implementation.
 * Takes any type of boolean link. Can be easily styled.
 *
 *     <Checkbox $checked={ boolLink } />
 */
export declare const Checkbox: ({ className, $checked, children }: {
    $checked: Link<boolean>;
} & React.HTMLProps<HTMLDivElement>) => JSX.Element;
export declare const DelayedInput: ({ $value, timeout, ...props }: {
    [x: string]: any;
    $value: any;
    timeout?: number;
}) => JSX.Element;
