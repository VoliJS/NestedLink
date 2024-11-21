import * as React from 'react';
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
/**
 * A custom input component that binds its value to a `PurePtr` object.
 *
 * @param {PurePtr<any>} props.valuePtr - A pointer object that holds the value of the input element.
 * @param {PurePtr<boolean>} props.checkedPtr - A pointer object that holds the checked state of the input element.
 * @returns {JSX.Element} The rendered input element.
 *
 * @example
 *    <Input valuePtr={ textValuePtr }/>
 *    <Input type="checkbox" checkedPtr={ checkedValuePtr }/>
 */
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
 * A custom textarea component that binds its value to a `PurePtr` object.
 *
 * @param {PurePtr<string>} props.valuePtr - A pointer object that holds the value of the textarea element.
 * @returns {JSX.Element} The rendered textarea element.
 *
 * @example
 *    <TextArea valuePtr={ textValuePtr }/>
 */
export const TextArea = ({ valuePtr, ...props }) => (React.createElement("textarea", { ...props, className: validationClasses(props, valuePtr.value, valuePtr.error), value: valuePtr.value, onChange: e => valuePtr.set(e.target.value) }));
/**
 * A custom select component that binds its value to a `PurePtr` object.
 *
 * @param {PurePtr<any>} props.valuePtr - A pointer object that holds the value of the select element.
 * @returns {JSX.Element} The rendered select element.
 *
 * @example
 *    <Select valuePtr={ selectedValuePtr }>
 *         <option value="option1value">Option 1</option>
*          <option value="option2value">Option 2</option>
 *   </Select>
 */
export const Select = ({ valuePtr, children, ...props }) => (React.createElement("select", { ...props, value: valuePtr.value, onChange: e => valuePtr.set(e.target.value) }, children));
