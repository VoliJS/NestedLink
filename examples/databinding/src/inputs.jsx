import React from 'react';
import { Input, NumberInput, Select, TextArea } from 'linked-controls';

export const isNumber = x => !isNaN( Number( x ) );

export const Numeric = ({ $num }) => (
    <fieldset>
        <legend>Number fields with wrong input rejection</legend>

        <label>
            Number
            <NumberInput $value={ $num }/>
        </label>

        <label>
            Positive
            <NumberInput $value={ $num } positive={ true } />
        </label>

        <label>
            Integer
            <NumberInput $value={ $num } integer={ true } />
        </label>
    </fieldset>
);

export const SimpleBinding = ({ $str, $bool }) => {
    $str.check( isNumber );

    return (
        <fieldset>
            <legend>Direct state fields binding</legend>

            <label>
                Standard input
                <input { ...$str.props }/>
            </label>

            <label>
                String
                <Input $value={ $str }/>
            </label>

            <label>
                TextArea
                <TextArea $value={ $str }/>
            </label>

            <label>
                Checkbox bound to bool
                <Input type="checkbox" $checked={ $bool }/>
            </label>
        </fieldset>
    );
};

export const SelectOption = ({ $flag }) =>(
    <fieldset>
        <legend>Select option from list</legend>
        <label>Select:
            <Select $value={ $flag }>
                <option value="a">a</option>
                <option value="b">b</option>
            </Select>
        </label>
    </fieldset>
);