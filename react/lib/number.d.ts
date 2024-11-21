import * as React from 'react';
import { PurePtr } from '@pure-ptr/core';
/**
 * Props for the NumberInput component.
 *
 * @interface NumberInputProps
 * @extends {Omit<React.HTMLProps<HTMLInputElement>, 'placeholder'>}
 *
 * @property {boolean} [positive] - If true, only positive numbers are allowed.
 * @property {boolean} [integer] - If true, only integer numbers are allowed.
 * @property {PurePtr<number|null>} valuePtr - A pointer to the value of the input.
 * @property {boolean} [nullable] - If true, the input can be null (represented as an empty string).
 * @property {number | string} [placeholder] - The placeholder text or number for the input.
 */
export interface NumberInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'placeholder'> {
    positive?: boolean;
    integer?: boolean;
    valuePtr: PurePtr<number | null>;
    nullable?: boolean;
    placeholder?: number | string;
}
/**
 * A React component for handling numeric input with optional constraints for positive and integer values.
 *
 * @extends {React.Component<NumberInputProps, {}>}
 *
 * @property {PurePtr<number>} props.valuePtr - A pointer object that holds the value of the input element.
 * @property {boolean} props.positive - A flag to indicate that the input should only accept positive numbers.
 * @property {boolean} props.integer - A flag to indicate that the input should only accept integer numbers.
 * @property {boolean} props.nullable - A flag to indicate that the input can be null.
 *
 * @example
 *   <NumberInput valuePtr={ numberValuePtr }/>
 *   <NumberInput valuePtr={ numberValuePtr } nullable />
 *   <NumberInput valuePtr={ numberValuePtr } positive/>
 *   <NumberInput valuePtr={ numberValuePtr } integer/>
 *   <NumberInput valuePtr={ numberValuePtr } positive integer/>
 */
export declare class NumberInput extends React.Component<NumberInputProps, {}> {
    componentWillMount(): void;
    value: string;
    error: any;
    setValue(x: number | string | null): void;
    setAndConvert(x: number | null): void;
    componentWillReceiveProps({ valuePtr }: NumberInputProps): void;
    get valueAsNumber(): number | null;
    render(): React.JSX.Element;
    onFocus: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
    onKeyPress: (e: {
        ctrlKey?: any;
        preventDefault?: any;
        charCode?: any;
    }) => void;
    onChange: (e: {
        target: {
            value: string;
        };
    }) => void;
}
