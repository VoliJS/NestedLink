import React from 'react';
import { Checkbox, Input } from '@linked/controls';

export const CheckboxObjGroup = ({ $flags }) => {
    const flags$ = $flags.pick();

    return (
        <fieldset>
            <legend>Standard checkbox group bound to object</legend>
            <label>
                A: <Input type="checkbox" $checked={ flags$.a }/>
            </label>
            <label>
                B: <input type="checkbox" { ...flags$.b.props }/>
            </label>
        </fieldset>
    );
}

export const CustomCheckboxObjGroup = ({ $flags }) => (
    <fieldset>
        <legend>Custom checkbox group bound to object</legend>
        <label>
            A: <Checkbox $checked={ $flags.at( 'a' ) }/>
        </label>
        <label>
            B: <Checkbox $checked={ $flags.at( 'b' ) }/>
        </label>
    </fieldset>
);

export const CheckboxListGroup = ({ $flags }) => (
    <fieldset>
        <legend>Checkbox group bound to list</legend>
        <label>
            A: <Input type="checkbox" $checked={ $flags.contains( 'a' ) }/>
        </label>
        <label>
            B: <Input type="checkbox" $checked={ $flags.contains( 'b' ) }/>
        </label>
    </fieldset>
);