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
var setValue = function (x, e) { return e.target.value; };
var setBoolValue = function (x, e) { return Boolean(e.target.checked); };
/**
 * Wrapper for standard <input/> to be compliant with React 0.14 $value semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *      <input type="checkbox" $checked={ linkToBool } />
 *      <input type="radio"    $value={ linkToSelectedValue } value="option1value" />
 *      <input type="text"     $value={ linkToString } />
 */
function appendClass(classes, name) {
    return classes ? classes + ' ' + name : name;
}
function validationClasses(props, value, error) {
    var classes = props.className || '';
    if (!error)
        return classes;
    return appendClass(classes, value === '' ?
        props.requiredClass || 'required' :
        props.invalidClass || 'invalid');
}
exports.validationClasses = validationClasses;
function Input(props) {
    var $value = props.$value, $checked = props.$checked, rest = __rest(props, ["$value", "$checked"]), type = props.type, link = $value || $checked;
    switch (type) {
        case 'checkbox':
            return React.createElement("input", __assign({}, rest, { checked: Boolean(link.value), onChange: link.action(setBoolValue) }));
        case 'radio':
            return React.createElement("input", __assign({}, rest, { checked: $checked ? $checked.value : $value.value === props.value, onChange: function (e) { e.target.checked && ($checked ? $checked.set(true) : link.set(props.value)); } }));
        default:
            return React.createElement("input", __assign({}, rest, { className: validationClasses(rest, $value.value, $value.error), value: String($value.value), onChange: $value.action(setValue) }));
    }
}
exports.Input = Input;
;
/**
 * Wrapper for standard <textarea/> to be compliant with React 0.14 $value semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *     <TextArea $value={ linkToText } />
 */
exports.TextArea = function (_a) {
    var $value = _a.$value, props = __rest(_a, ["$value"]);
    return (React.createElement("textarea", __assign({}, props, { className: validationClasses(props, $value.value, $value.error), value: $value.value, onChange: $value.action(setValue) })));
};
/**
 * Wrapper for standard <select/> to be compliant with React 0.14 $value semantic.
 * Regular <option/> tags must be used:
 *
 *     <Select $value={ linkToSelectedValue }>
 *         <option value="a">A</option>
 *         <option value="b">B</option>
 *     </Select>
 */
exports.Select = function (_a) {
    var $value = _a.$value, children = _a.children, props = __rest(_a, ["$value", "children"]);
    return (React.createElement("select", __assign({}, props, { value: $value.value, onChange: $value.action(setValue) }), children));
};
//# sourceMappingURL=standard.js.map