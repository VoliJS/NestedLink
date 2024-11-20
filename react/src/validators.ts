import { PurePtr } from '@pure-ptr/core'

/**
 * Validator to check if a value is not empty.
 * 
 * This validator returns `true` if the value is not `null` or `undefined` and is not an empty string.
 * 
 * @param x - The value to validate.
 * @returns `true` if the value is not `null`, `undefined`, or an empty string; otherwise, `false`.
 */
export const isRequired : PurePtr.Validator<any> = x => x != null && x !== '';
isRequired.error = 'Required';

const emailPattern   = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

/**
 * Validates if the given string is an email.
 *
 * @param x - The string to validate.
 * @returns `true` if the string matches the email pattern, otherwise `false`.
 */
export const isEmail : PurePtr.Validator<string> = x => Boolean( x.match( emailPattern ) );
isEmail.error = 'Should be an email';

/**
 * Validator to check if a given value is a number.
 *
 * @param x - The value to be validated.
 * @returns `true` if the value is a number, otherwise `false`.
 */
export const isNumber : PurePtr.Validator<any> = x => !isNaN( Number( x ) );
isNumber.error = 'Should be a number';