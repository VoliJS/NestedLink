import Linked, { useStatePtr, useLocalStoragePtr, PurePtr } from '@pure-ptr/react';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { EditUser, User } from './edit';
import { Header, UserRow } from './grid';
import './main.css';

const newUser = {
    name : '',
    email : '',
    isActive : true
}

export const UsersList = () => {
    // Declare the local state.
    const usersPtr = useLocalStoragePtr<User[]>( 'users', [] ),
        dialogPtr  = useStatePtr<string|null>( null ),
        editingPtr = useStatePtr<number|null>( null );

    // Create the function which sets dialog to `null`.
    const closeDialog = () => dialogPtr.set( null );

    // Function to open the dialog.
    function openDialog( name : string, editing : number| null = null ){
        dialogPtr.set( name );
        editingPtr.set( editing );
    }

    return (
        <div>
            <button onClick={ () => openDialog( 'addUser' ) }>
                Add User
            </button>

            <Header/>

            { usersPtr.map( ( userPtr, i ) => (
                <UserRow key={ i }
                            userPtr={ userPtr }
                            onEdit={ () => openDialog( 'editUser', i ) }
                />
            ) )}

            <Modal isOpen={ dialogPtr.value === 'addUser' }>
                <EditUser userPtr={
                        /* The custom link to add created user to the state */
                        PurePtr.value( newUser, x => usersPtr.push( x ) )
                    }
                    onClose={ closeDialog } />
            </Modal>

            { editingPtr.value != null ?
                <Modal isOpen={ true }>
                    <EditUser 
                        userPtr={ usersPtr.at( editingPtr.value ) }
                        onClose={ () => editingPtr.set( null ) }/>
                </Modal>
            : void 0 }
        </div>
    );
}

const root = document.getElementById( 'app-mount-root' );
ReactDOM.render( <UsersList />, root );