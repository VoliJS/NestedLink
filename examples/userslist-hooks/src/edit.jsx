import React from 'react';
import Link, { useBoundLink } from 'valuelink';
import { Input, ValidatedInput, isRequired, isEmail } from './controls.jsx';

export const EditUser = ({ $user, onClose }) => {
    // Initialize local state
    const user = useBoundLink( $user.value ).$links();

    // Form submit handler
    function onSubmit( e ){
        e.preventDefault();
        
        // Assign local state back to the props
        $user.set( Link.getValues( user ) );

        // Close the dialog
        onClose();
    }

    // Apply validation rules
    user.$name
        .check( isRequired )
        .check( x => x.indexOf( ' ' ) < 0, 'Spaces are not allowed' );

    user.$email
        .check( isRequired )
        .check( isEmail );

    return (
        <form onSubmit={ onSubmit }>
            <label>
                Name: <ValidatedInput type="text" $value={ user.$name }/>
            </label>

            <label>
                Email: <ValidatedInput type="text" $value={ user.$email }/>
            </label>

            <label>
                Is active: <Input type="checkbox" $value={ user.$isActive }/>
            </label>

            <button type="submit" disabled={ Link.hasErrors( user ) }>
                Save
            </button>
            <button type="button" onClick={ onClose }>
                Cancel
            </button>
        </form>
    );
}

