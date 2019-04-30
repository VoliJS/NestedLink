import './main.css'
import ReactDOM from 'react-dom'

import React, { useEffect } from 'react'
import PropTypes from 'proptypes'

import Link, { useLink } from 'valuelink'
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
                        Link.value( {}, x => users.push( x ) )
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
    // Initialize local state on mount taking it from the userLink
    const user = useLink( () =>({
        name     : '',
        email    : '',
        isActive : true,
        ...userLink.value
    }));

    // Form submit handler
    function onSubmit( e ){
        e.preventDefault();

        userLink.set( user.value );
        onClose();
    }

    // Extract links to `localUser` elements
    const { name, email, isActive } = user.pick();

    // Apply validation rules
    name.check( isRequired )
        .check( x => x.indexOf( ' ' ) < 0, 'Spaces are not allowed' );

    email.check( isRequired )
         .check( isEmail );

    return (
        <form onSubmit={ onSubmit }>
            <label>
                Name: <ValidatedInput type="text" valueLink={ name }/>
            </label>

            <label>
                Email: <ValidatedInput type="text" valueLink={ email }/>
            </label>

            <label>
                Is active: <Input type="checkbox" checkedLink={ isActive }/>
            </label>

            <button type="submit" disabled={ name.error || email.error }>
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
