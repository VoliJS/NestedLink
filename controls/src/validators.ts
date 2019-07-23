import { Validator } from 'valuelink'

export const isRequired : Validator<any> = x => x != null && x !== '';
isRequired.error = 'Required';

const emailPattern   = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

export const isEmail : Validator<string> = x => Boolean( x.match( emailPattern ) );
isEmail.error = 'Should be an email';

export const isNumber = x => !isNaN( Number( x ) );
isNumber.error = 'Should be a number';