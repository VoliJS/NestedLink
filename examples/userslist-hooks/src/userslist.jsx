import './main.css'
import ReactDOM from 'react-dom'

import React, { useEffect } from 'react'

import Link, { useLink, useLinkedState } from 'valuelink'
import Modal from 'react-modal'
import {Input, isRequired, isEmail } from 'valuelink/tags'

export const UsersList = () => {
    // Declare the local state.
    const users = useLink( [] ),
        dialog  = useLink( null ),
        editing = useLink( null );

    // Create the function which sets dialog to `null`.
    const closeDialog = dialog.action( () => null );

    // Function to open the dialog.
    function openDialog( name, editing = null ){
        dialog.set( name );
        editing.set( editing );
    }

    return (
        <div>
            <button onClick={ () => openDialog( 'addUser' ) }>
                Add User
            </button>

            <Header/>

            { users.map( ( userLink, i ) => (
                <UserRow key={ i }
                            userLink={ userLink }
                            onEdit={ () => openDialog( 'editUser', i ) }
                />
            ) )}

            <Modal isOpen={ dialog === 'addUser' }>
                <EditUser userLink={
                        /* The custom link to add created user to the state */
                        Link.value( null, x => users.push( x ) )
                    }
                    onClose={ closeDialog } />
            </Modal>

            <Modal isOpen={ dialog === 'editUser' }>
                <EditUser userLink={ users.at( editing ) }
                            onClose={ closeDialog }/>
            </Modal>
        </div>
    );
}

const Header = () =>(
    <div className="users-row">
        <div>Name</div>
        <div>Email</div>
        <div>Is Active</div>
        <div/>
    </div>
);

const UserRow = ( { userLink, onEdit } ) =>{
    const isActiveLink = userLink.at( 'isActive' ),
          user         = userLink.value;

    return (
        <div className="users-row" onDoubleClick={ onEdit }>
            <div>{ user.name }</div>
            <div>{ user.email }</div>
            <div onClick={ isActiveLink.action( x => !x ) }>
                { user.isActive ? 'Yes' : 'No' }</div>
            <div>
                <button onClick={ onEdit }>Edit</button>
                <button onClick={ () => userLink.remove() }>X</button>
            </div>
        </div>
    )
};


const EditUser = ({ userLink, onClose }) => {
    // Initialize local state
    const user = useLinkedState( userLink ).pick();

    // Form submit handler
    function onSubmit( e ){
        e.preventDefault();
        
        // Assign local state back to the props
        userLink.set( Link.getValues( user ) );

        // Close the dialog
        onClose();
    }

    function onClear(){
        // Assign local state back to the props
        Link.setValues( user, userLink.value );
    }

    // Apply validation rules
    user.name
        .check( isRequired )
        .check( x => x.indexOf( ' ' ) < 0, 'Spaces are not allowed' );

    user.email
        .check( isRequired )
        .check( isEmail );

    return (
        <form onSubmit={ onSubmit }>
            <label>
                Name: <ValidatedInput type="text" valueLink={ user.name }/>
            </label>

            <label>
                Email: <ValidatedInput type="text" valueLink={ user.email }/>
            </label>

            <label>
                Is active: <Input type="checkbox" checkedLink={ user.isActive }/>
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

const ValidatedInput = ( props ) => (
    <div>
        <Input { ...props } />
        <div className="validation-error">
            { props.valueLink.error || '' }
        </div>
    </div>
);

ReactDOM.render( <UsersList />, document.getElementById( 'app-mount-root' ) );
