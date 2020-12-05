import { DelayedInput } from '@linked/controls';
import React from 'react';
import { useIO, useLinked, useSafeLinked } from '@linked/react';
import { doSomething as fetchUsers } from './io-mock';

export const PickUser = ({ $selected }) => {
    const $editing = useLinked( false );

    return (
        <div>
            { $editing.value ?
                <EditUser $selected={$selected}
                          close={() => $editing.set( false )}/>
            :
                <input value={ userToString( $selected.value ) }
                       onClick={ () => $editing.set( true ) }/>
            }
        </div>
    )
}

export const EditUser = ({ $selected, close }) => {
    const $filter = useLinked('');

    return (
        <div>
            <DelayedInput autoFocus
                $value={ $filter }
                placeholder="Start typing..."
                onBlur={ close } />
            
            { $filter.value ?
                <UsersList filter={$filter.value} $selected={$selected} />
            : void 0 }
        </div>
    );
}

const UsersList = ({ filter, $selected }) => {
    const $users = useSafeLinked([]);

    const ioComplete = useIO( async () => {
        $users.set( await fetchUsers( filter ) );
    }, [ filter ]);

    return (
        <ul className="users-suggestions">
            { ioComplete ? $users.value.map( user => (
                <li key={user.id}
                    className={ $selected.value && $selected.value.id === user.id ? 'selected' : '' }
                    onMouseDown={ () => $selected.set( user ) }
                >
                    { userToString( user ) }
                </li>
            )) : 'Loading...' }
        </ul>
    )
}

function userToString( user ){
    return user ? user.name + ' <' + user.email + '>' : '';
}