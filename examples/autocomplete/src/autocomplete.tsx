import React from 'react';
import { useIO, useStatePtr, DelayedInput, PurePtr } from '@pure-ptr/react';
import { fetchUsers, User } from './io-mock';

export const PickUser = ({ selectedPtr } : {
    selectedPtr : PurePtr<User|null>
}) => {
    const editingPtr = useStatePtr( false );

    return (
        <div>
            { editingPtr.isTruthy ?
                <EditUser selectedPtr={selectedPtr}
                          close={() => editingPtr.set( false )}/>
            :
                <input value={ userToString( selectedPtr.value ) }
                       onClick={ () => editingPtr.set( true ) }/>
            }
        </div>
    )
}

export const EditUser = ({ selectedPtr, close } : {
    selectedPtr : PurePtr<User|null>,
    close : () => void
}) => {
    const filterPtr = useStatePtr('');

    return (
        <div>
            <DelayedInput autoFocus
                valuePtr={ filterPtr }
                placeholder="Start typing..."
                onBlur={ close } />
            
            { filterPtr.isTruthy ?
                <UsersList filter={filterPtr.value} selectedPtr={selectedPtr} />
            : void 0 }
        </div>
    );
}

const UsersList = ({ filter, selectedPtr } : {
    filter : string,
    selectedPtr : PurePtr<User|null>
}) => {
    const usersPtr = useStatePtr<User[]>( [] );

    const { isReady } = useIO( async abort => {
        usersPtr.set( await fetchUsers( filter, abort ) );
    }, [ filter ]);

    return (
        <ul className="users-suggestions">
            { isReady ? 
                usersPtr.value.map( user => (
                    <li key={user.id}
                        className={ selectedPtr.value && selectedPtr.value.id === user.id ? 'selected' : '' }
                        onMouseDown={ () => selectedPtr.set( user ) }
                    >
                        { userToString( user ) }
                    </li>
                )) 
            :
                'Loading...' 
            }
        </ul>
    )
}

function userToString( user : User | null ) : string {
    return user ? user.name + ' <' + user.email + '>' : '';
}