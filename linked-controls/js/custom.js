"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var valuelink_1 = require("valuelink");
var hooks_1 = require("./hooks");
/**
 * Simple custom <Radio/> tag implementation. Can be easily styled.
 * Intended to be used with offhand bool link:
 *
 *    <Radio $checked={ linkToValue.equals( optionValue ) />
 */
exports.Radio = function (_a) {
    var _b = _a.className, className = _b === void 0 ? 'radio' : _b, $checked = _a.$checked, children = _a.children;
    return (React.createElement("div", { className: className + ($checked.value ? ' selected' : ''), onClick: $checked.action(function () { return true; }) }, children));
};
/**
 * Simple custom <Checkbox /> tag implementation.
 * Takes any type of boolean link. Can be easily styled.
 *
 *     <Checkbox $checked={ boolLink } />
 */
exports.Checkbox = function (_a) {
    var _b = _a.className, className = _b === void 0 ? 'checkbox' : _b, $checked = _a.$checked, children = _a.children;
    return (React.createElement("div", { className: className + ($checked.value ? ' selected' : ''), onClick: $checked.action(function (x) { return !x; }) }, children));
};
exports.DelayedInput = function (_a) {
    var $value = _a.$value, _b = _a.timeout, timeout = _b === void 0 ? 1000 : _b, props = __rest(_a, ["$value", "timeout"]);
    var $inputValue = valuelink_1.useBoundLink($value)
        .onChange(hooks_1.useThrottle(function (x) { return $value.set(x); }, timeout, [$value.value]));
    return React.createElement("input", __assign({}, $inputValue.props, props));
};
//# sourceMappingURL=custom.js.map