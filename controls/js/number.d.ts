import * as React from 'react';
import { Link } from '@linked/react';
export interface NumberInputProps extends React.HTMLProps<HTMLInputElement> {
    positive?: boolean;
    integer?: boolean;
    currency?: boolean;
    $value: Link<number>;
}
export declare class NumberInput extends React.Component<NumberInputProps, {}> {
    componentWillMount(): void;
    value: string;
    error: any;
    setValue(x: any): void;
    setAndConvert(x: any): void;
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
    onKeyPress: (e: any) => void;
    onChange: (e: any) => void;
}
