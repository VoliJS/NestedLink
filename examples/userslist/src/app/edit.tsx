import React from 'react';
import { Input, ValidatedInput, isRequired, isEmail } from './controls.js';
import { PurePtr, useLinkedStatePtr } from '@pure-ptr/react';

export interface User {
    name : string,
    email : string,
    isActive : boolean
}

export const EditUser = ({ userPtr, onClose } : {
    userPtr : PurePtr<User>,
    onClose : () => void
}) => {
    // Initialize local state
    const localUserPtr = useLinkedStatePtr( userPtr );

    // Form submit handler
    function onSubmit( e: React.FormEvent<HTMLFormElement> ): void {
        e.preventDefault();
        
        // Assign local state back to the props
        userPtr.set( localUserPtr.value );

        // Close the dialog
        onClose();
    }

    // Apply validation rules
    const namePtr = localUserPtr.at( 'name' )
        .check( isRequired )
        .check( x => x.indexOf( ' ' ) < 0, 'Spaces are not allowed' );

    const emailPtr = localUserPtr.at( 'email' )
        .check( isRequired )
        .check( isEmail );

    return (
        <form onSubmit={ onSubmit }>
            <label>
                Name: <ValidatedInput type="text" valuePtr={ namePtr }/>
            </label>

            <label>
                Email: <ValidatedInput type="text" valuePtr={ emailPtr }/>
            </label>

            <label>
                Is active: <Input type="checkbox" checkedPtr={ localUserPtr.at( 'isActive' ) }/>
            </label>

            <button type="submit" disabled={ PurePtr.haveErrors( namePtr, emailPtr ) }>
                Save
            </button>
            
            <button type="button" onClick={ onClose }>
                Cancel
            </button>
        </form>
    );
}
