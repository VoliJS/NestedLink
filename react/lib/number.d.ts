import * as React from 'react';
import { PurePtr } from '@pure-ptr/core';
export interface NumberInputProps extends React.HTMLProps<HTMLInputElement> {
    positive?: boolean;
    integer?: boolean;
    valuePtr: PurePtr<number>;
}
export declare class NumberInput extends React.Component<NumberInputProps, {}> {
    componentWillMount(): void;
    value: string;
    error: any;
    setValue(x: number): void;
    setAndConvert(x: number): void;
    componentWillReceiveProps(nextProps: NumberInputProps): void;
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
            value: any;
        };
    }) => void;
}
