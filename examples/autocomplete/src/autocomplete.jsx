import React from 'react'
import Link, { useSafeLink, useLink, useIO } from 'valuelink';
import { doSomething } from './io-mock'
import { ThrottledInput } from 'linked-controls'

export const PickUser = ({ $selected }) => {
    const $showList = useLink( false ),
          $filter = useLink('');

    return (
        <div>
            <ThrottledInput $value={ $showList.value ? $filter : Link.value( userToString( $selected.value ) ) }
                placeholder="Start typing..."
                onFocus={() => $showList.set( true )}
                onBlur={onBlur}
                 />
            
            { $showList.value ?
                <List filter={$filter.value} $selected={$selected} /> 
            : void 0 }
        </div>
    );

    function onBlur(){
        $showList.set( false );
        $filter.set( '' );
    }
}

const List = ({ filter, $selected }) => {
    const $users = useSafeLink([]);

    const ioComplete = useIO( async () => {
        filter.length > 0 && $users.set( await doSomething( filter ) );
    }, [ filter ]);

    return filter ? (
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
    ) : <div/>
}

function userToString( user ){
    return user ? user.name + ' <' + user.email + '>' : '';
}