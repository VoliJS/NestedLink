import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Link, { useLink, useLinkedState, useLocalStorage } from 'valuelink';
import { Input, isEmail, isRequired } from 'linked-controls';
import './main.css';

const newUser = {
    name : '',
    email : '',
    isActive : true
}

export const UsersList = () => {
    // Declare the local state.
    const $users = useLink( [] ),
        $dialog  = useLink( null ),
        $editing = useLink( null );

    useLocalStorage({ $users });

    // Create the function which sets dialog to `null`.
    const closeDialog = $dialog.action( () => null );

    // Function to open the dialog.
    function openDialog( name, editing = null ){
        $dialog.set( name );
        $editing.set( editing );
    }

    return (
        <div>
            <button onClick={ () => openDialog( 'addUser' ) }>
                Add User
            </button>

            <Header/>

            { $users.map( ( $user, i ) => (
                <UserRow key={ i }
                            $user={ $user }
                            onEdit={ () => openDialog( 'editUser', i ) }
                />
            ) )}

            <Modal isOpen={ $dialog.value === 'addUser' }>
                <EditUser $user={
                        /* The custom link to add created user to the state */
                        Link.value( newUser, x => $users.push( x ) )
                    }
                    onClose={ closeDialog } />
            </Modal>

            <Modal isOpen={ $dialog.value === 'editUser' }>
                <EditUser $user={ $users.at( $editing.value ) }
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

const UserRow = ( { $user, onEdit } ) =>{
    const $isActive = $user.at( 'isActive' ),
          user      = $user.value;

    return (
        <div className="users-row" onDoubleClick={ onEdit }>
            <div>{ user.name }</div>
            <div>{ user.email }</div>
            <div onClick={ $isActive.action( x => !x ) }>
                { user.isActive ? 'Yes' : 'No' }</div>
            <div>
                <button onClick={ onEdit }>Edit</button>
                <button onClick={ () => $user.remove() }>X</button>
            </div>
        </div>
    )
};


const EditUser = ({ $user, onClose }) => {
    // Initialize local state
    const user = useLinkedState( $user ).$links();

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

const ValidatedInput = ( props ) => (
    <div>
        <Input { ...props } />
        <div className="validation-error">
            { props.$value.error || '' }
        </div>
    </div>
);

ReactDOM.render( <UsersList />, document.getElementById( 'app-mount-root' ) );
