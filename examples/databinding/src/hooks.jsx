/**
 * ValueLink Data binding examples
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */

import React from 'react';
import { useLink } from 'valuelink';

export const HooksExample = () => {
    const $email = useLink( '' ),
          $isRealEmail = useLink( true );

    return (
        <fieldset>
            <legend>Cool React hooks</legend>
            
            <label>
                Email: <input { ...$email.props } />
            </label>

            <label>
                Is real email: <input type="radio" { ...$isRealEmail.equals( true ).props } />
            </label>
            <label>
                It was fake! <input type="radio" { ...$isRealEmail.equals( false ).props } />
            </label>
        </fieldset>
    )
}
