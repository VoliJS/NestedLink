import React from 'react';
import { Input, Radio } from 'linked-controls';

export const RadioGroup = ({ $flag }) => (
    <fieldset>
        <legend>Radio group bound to value</legend>
        <label>
            A: <Input type="radio" $value={ $flag } value="a" />
        </label>
        <label>
            B: <input type="radio" { ...$flag.equals( 'b' ).props } />
        </label>
    </fieldset>
);

export const CustomRadioGroup = ({ $flag }) => (
    <fieldset>
        <legend>Custom Radio group bound to value</legend>
        <label>
            A: <Radio $checked={ $flag.equals( 'a' ) } />
        </label>
        <label>
            B: <Radio $checked={ $flag.equals( 'b' ) } />
        </label>
    </fieldset>
);