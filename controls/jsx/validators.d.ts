import { Validator } from 'valuelink';
export declare const isRequired: Validator<any>;
export declare const isEmail: Validator<string>;
export declare const isNumber: {
    (x: any): boolean;
    error: string;
};
