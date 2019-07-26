import { Linked } from '@linked/react';
export declare const isRequired: Linked.Validator<any>;
export declare const isEmail: Linked.Validator<string>;
export declare const isNumber: {
    (x: any): boolean;
    error: string;
};
