import React from 'react';
import { isNumber, Input, NumberInput, Select, TextArea, PurePtr } from '@pure-ptr/react';

export const Numeric = ({ numPtr }:{
    numPtr : PurePtr<number>
}) => (
    <fieldset>
        <legend>Number fields with wrong input rejection</legend>

        <label>
            Number
            <NumberInput valuePtr={ numPtr }/>
        </label>

        <label>
            Positive
            <NumberInput valuePtr={ numPtr } positive={ true } />
        </label>

        <label>
            Integer
            <NumberInput valuePtr={ numPtr } integer={ true } />
        </label>
    </fieldset>
);

export const SimpleBinding = ({ strPtr, boolPtr }:{
    strPtr : PurePtr<string>,
    boolPtr : PurePtr<boolean>
}) => {
    strPtr.check(isNumber);

    return (
        <fieldset>
            <legend>Direct state fields binding</legend>

            <label>
                Standard input
                <input { ...strPtr.props }/>
            </label>

            <label>
                String
                <Input valuePtr={ strPtr }/>
            </label>

            <label>
                TextArea
                <TextArea valuePtr={ strPtr }/>
            </label>

            <label>
                Checkbox bound to bool
                <Input type="checkbox" checkedPtr={ boolPtr }/>
            </label>
        </fieldset>
    );
};

export const SelectOption = ({ flagPtr }:{
    flagPtr : PurePtr<string>
}) => (
    <fieldset>
        <legend>Select option from list</legend>
        <label>Select:
            <Select valuePtr={ flagPtr }>
                <option value="a">a</option>
                <option value="b">b</option>
            </Select>
        </label>
    </fieldset>
);