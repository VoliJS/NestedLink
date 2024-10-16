/**
 * ValueLink Data binding examples
 *
 * MIT License, (c) 2016 Vlad Balin, Volicon.
 */

import React from 'react';
import { useStatePtr, isEmail, Input } from '@pure-ptr/react';

export const HooksExample = () => {
    const emailPtr = useStatePtr( '' ).check( isEmail ),
          isRealEmailPtr = useStatePtr( true );

    return (
        <fieldset>
            <legend>Cool React hooks</legend>
            
            <label>
                Email: <Input valuePtr={emailPtr} />
            </label>

            <label>
                Is real email: <input type="radio" { ...isRealEmailPtr.equals( true ).props } />
            </label>
            <label>
                It was fake! <Input type="radio" checkedPtr={ isRealEmailPtr.equals( false ) } />
            </label>
        </fieldset>
    )
}
