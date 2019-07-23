/**
 * ValueLink Data binding examples
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */

import React from 'react';
import { useLink } from '@linked/react';
import { isEmail, Input } from '@linked/controls';

export const HooksExample = () => {
    const $email = useLink( '' ).check( isEmail ),
          $isRealEmail = useLink( true );

    return (
        <fieldset>
            <legend>Cool React hooks</legend>
            
            <label>
                Email: <Input $value={$email} />
            </label>

            <label>
                Is real email: <input type="radio" { ...$isRealEmail.equals( true ).props } />
            </label>
            <label>
                It was fake! <Input type="radio" $checked={ $isRealEmail.equals( false ) } />
            </label>
        </fieldset>
    )
}
