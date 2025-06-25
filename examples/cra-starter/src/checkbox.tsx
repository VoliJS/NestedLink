import React from 'react';
import { PurePtr, Checkbox, Input } from '@pure-ptr/react';

export const CheckboxObjGroup = ({ flagsPtr } : {
    flagsPtr : PurePtr<{ a : boolean, b : boolean }>
}) => {
    const [ aPtr, bPtr ] = flagsPtr.pick( 'a', 'b' );

    return (
        <fieldset>
            <legend>Standard checkbox group bound to object</legend>
            <label>
                A: <Input type="checkbox" checkedPtr={ aPtr }/>
            </label>
            <label>
                B: <input type="checkbox" { ...bPtr.props }/>
            </label>
        </fieldset>
    );
}

export const CustomCheckboxObjGroup = ({ flagsPtr } : {
    flagsPtr : PurePtr<{ a : boolean, b : boolean }>
}) => (
    <fieldset>
        <legend>Custom checkbox group bound to object</legend>
        <label>
            A: <Checkbox checkedPtr={ flagsPtr.at( 'a' ) }/>
        </label>
        <label>
            B: <Checkbox checkedPtr={ flagsPtr.at( 'b' ) }/>
        </label>
    </fieldset>
);

export const CheckboxListGroup = ({ flagsPtr } : {
    flagsPtr : PurePtr<string[]>
}) => (
    <fieldset>
        <legend>Checkbox group bound to list</legend>
        <label>
            A: <Input type="checkbox" checkedPtr={ flagsPtr.contains( 'a' ) }/>
        </label>
        <label>
            B: <Input type="checkbox" checkedPtr={ flagsPtr.contains( 'b' ) }/>
        </label>
    </fieldset>
);