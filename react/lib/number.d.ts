import { PurePtr } from '@pure-ptr/core';
import React from 'react';
interface NumberInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'placeholder'> {
    positive?: boolean;
    integer?: boolean;
    valuePtr: PurePtr<number | null>;
    nullable?: boolean;
    placeholder?: number | string;
}
export declare const NumberInput: (props: NumberInputProps) => React.JSX.Element;
export default NumberInput;
//# sourceMappingURL=number.d.ts.map