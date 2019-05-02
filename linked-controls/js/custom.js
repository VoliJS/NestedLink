"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
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
//# sourceMappingURL=custom.js.map