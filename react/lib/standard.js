import * as React from 'react';
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
export function validationClasses(props, value, error) {
    const classes = props.className || '';
    if (!error)
        return classes;
    return appendClass(classes, value === '' ?
        props.requiredClass || 'required' :
        props.invalidClass || 'invalid');
}
export function Input(props) {
    const { valuePtr, checkedPtr, ...rest } = props, type = props.type, ptr = valuePtr || checkedPtr;
    switch (type) {
        case 'checkbox':
            return React.createElement("input", { ...rest, checked: Boolean(ptr.value), onChange: e => ptr.set(!ptr.value) });
        case 'radio':
            return React.createElement("input", { ...rest, checked: checkedPtr ? checkedPtr.value : valuePtr.value === props.value, onChange: e => { e.target.checked && (checkedPtr ? checkedPtr.set(true) : ptr.set(props.value)); } });
        default:
            return React.createElement("input", { ...rest, className: validationClasses(rest, valuePtr.value, valuePtr.error), value: String(ptr.value), onChange: e => ptr.set(e.target.value) });
    }
}
;
/**
 * Wrapper for standard <textarea/> to be compliant with React 0.14 $value semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *     <TextArea $value={ linkToText } />
 */
export const TextArea = ({ valuePtr, ...props }) => (React.createElement("textarea", { ...props, className: validationClasses(props, valuePtr.value, valuePtr.error), value: valuePtr.value, onChange: e => valuePtr.set(e.target.value) }));
/**
 * Wrapper for standard <select/> to be compliant with React 0.14 $value semantic.
 * Regular <option/> tags must be used:
 *
 *     <Select $value={ linkToSelectedValue }>
 *         <option value="a">A</option>
 *         <option value="b">B</option>
 *     </Select>
 */
export const Select = ({ valuePtr, children, ...props }) => (React.createElement("select", { ...props, value: valuePtr.value, onChange: e => valuePtr.set(e.target.value) }, children));
