import { PurePtr } from '@pure-ptr/core';
/**
 * Validator to check if a value is not empty.
 *
 * This validator returns `true` if the value is not `null` or `undefined` and is not an empty string.
 *
 * @param x - The value to validate.
 * @returns `true` if the value is not `null`, `undefined`, or an empty string; otherwise, `false`.
 */
export declare const isRequired: PurePtr.Validator<any>;
/**
 * Validates if the given string is an email.
 *
 * @param x - The string to validate.
 * @returns `true` if the string matches the email pattern, otherwise `false`.
 */
export declare const isEmail: PurePtr.Validator<string>;
/**
 * Validator to check if a given value is a number.
 *
 * @param x - The value to be validated.
 * @returns `true` if the value is a number, otherwise `false`.
 */
export declare const isNumber: PurePtr.Validator<any>;
