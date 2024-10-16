import { PurePtr } from '@pure-ptr/core';
export declare const isRequired: PurePtr.Validator<any>;
export declare const isEmail: PurePtr.Validator<string>;
export declare const isNumber: {
    (x: any): boolean;
    error: string;
};
