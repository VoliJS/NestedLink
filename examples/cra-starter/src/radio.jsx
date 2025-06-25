import React from 'react';
import { Input, Radio } from '@pure-ptr/react';

export const RadioGroup = ({ flagPtr }) => (
    <fieldset>
        <legend>Radio group bound to value</legend>
        <label>
            A: <Input type="radio" valuePtr={ flagPtr } value="a" />
        </label>
        <label>
            B: <input type="radio" { ...flagPtr.equals( 'b' ).props } />
        </label>
    </fieldset>
);

export const CustomRadioGroup = ({ flagPtr }) => (
    <fieldset>
        <legend>Custom Radio group bound to value</legend>
        <label>
            A: <Radio checkedPtr={ flagPtr.equals( 'a' ) } />
        </label>
        <label>
            B: <Radio checkedPtr={ flagPtr.equals( 'b' ) } />
        </label>
    </fieldset>
);