"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRequired = function (x) { return x != null && x !== ''; };
exports.isRequired.error = 'Required';
var emailPattern = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
exports.isEmail = function (x) { return Boolean(x.match(emailPattern)); };
exports.isEmail.error = 'Should be an email';
exports.isNumber = function (x) { return !isNaN(Number(x)); };
exports.isNumber.error = 'Should be a number';
//# sourceMappingURL=validators.js.map