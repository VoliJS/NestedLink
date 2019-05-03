import * as React from 'react';
const setValue = (x, e) => e.target.value;
const setBoolValue = (x, e) => Boolean(e.target.checked);
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
    const { $value, $checked, ...rest } = props, type = props.type, link = $value || $checked;
    switch (type) {
        case 'checkbox':
            return <input {...rest} checked={Boolean(link.value)} onChange={link.action(setBoolValue)}/>;
        case 'radio':
            return <input {...rest} checked={$checked ? $checked.value : $value.value === props.value} onChange={e => { e.target.checked && ($checked ? $checked.set(true) : link.set(props.value)); }}/>;
        default:
            return <input {...rest} className={validationClasses(rest, $value.value, $value.error)} value={String($value.value)} onChange={$value.action(setValue)}/>;
    }
}
;
/**
 * Wrapper for standard <textarea/> to be compliant with React 0.14 $value semantic.
 * Simple supports for link validation - adds 'invalid' class if link has an error.
 *
 *     <TextArea $value={ linkToText } />
 */
export const TextArea = ({ $value, ...props }) => (<textarea {...props} className={validationClasses(props, $value.value, $value.error)} value={$value.value} onChange={$value.action(setValue)}/>);
/**
 * Wrapper for standard <select/> to be compliant with React 0.14 $value semantic.
 * Regular <option/> tags must be used:
 *
 *     <Select $value={ linkToSelectedValue }>
 *         <option value="a">A</option>
 *         <option value="b">B</option>
 *     </Select>
 */
export const Select = ({ $value, children, ...props }) => (<select {...props} value={$value.value} onChange={$value.action(setValue)}>
        {children}
    </select>);
//# sourceMappingURL=standard.jsx.map