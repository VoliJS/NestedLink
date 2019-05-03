import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Link, { useLink, useLocalStorage } from 'valuelink';
import './main.css';
import { UserRow, Header } from './grid.jsx'
import { EditUser } from './edit.jsx'

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

    useLocalStorage( 'users', { $users });

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

const root = document.getElementById( 'app-mount-root' );
ReactDOM.render( <UsersList />, root );
window.onunload = () => ReactDOM.unmountComponentAtNode( root );
