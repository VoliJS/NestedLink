import * as React from 'react';
/**
 * Simple custom <Radio/> tag implementation. Can be easily styled.
 * Intended to be used with offhand bool link:
 *
 *    <Radio $checked={ linkToValue.equals( optionValue ) />
 */
export const Radio = ({ className = 'radio', $checked, children }) => (<div className={className + ($checked.value ? ' selected' : '')} onClick={$checked.action(() => true)}>
        {children}
    </div>);
/**
 * Simple custom <Checkbox /> tag implementation.
 * Takes any type of boolean link. Can be easily styled.
 *
 *     <Checkbox $checked={ boolLink } />
 */
export const Checkbox = ({ className = 'checkbox', $checked, children }) => (<div className={className + ($checked.value ? ' selected' : '')} onClick={$checked.action(x => !x)}>
        {children}
    </div>);
//# sourceMappingURL=custom.jsx.map