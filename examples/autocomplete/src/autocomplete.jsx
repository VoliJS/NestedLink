import React from 'react'
import { useEffect, useState, useRef } from 'react';
import Link, { useLinkedState, useLink, useIO } from 'valuelink';

// Delays function calls for a given timeout.
function useThrottle( fun, timeout, changes = [] ){
    const timer = useRef( null );

    function cancel(){
        if( timer.current ) clearTimeout( timer.current );
    }

    useEffect( () => cancel, changes );

    return function(){
        cancel();

        timer.current = setTimeout(()=>{
            timer.current = null;
            fun.apply( this, arguments );
        }, timeout );
    }
}

const ThrottledInput = ({ $value, timeout = 1000, ...props }) => {
    const $inputValue = useLinkedState( $value )
        .onChange(
            useThrottle(
                x => $value.set( x ),
                timeout,
                [ $value.value ]
            )
        );
    
    return <input {...$inputValue.props} {...props}/>;
}

function useSafeLink( init ){
    const [ value, set ] = useState( init );

    const isMounted = useRef( true );
    
    useEffect( () => (
        () => {
            isMounted.current = false;
        }
    ), []);

    return Link.value( value, x => isMounted.current && set( x ) );
}

export const Autocomplete = ({ $selected }) => {
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

function doSomething( filter ){
    return new Promise( resolve => {
        setTimeout( () => {
            resolve([{
                id: 1,
                name : 'Vlad Balin',
                email : 'vb@mail.co'
            },
            {
                id: 2,
                name : 'Vitaly Tsirulnikov',
                email : 'vt@mail.co'
            },{
                id: 3,
                name : 'Pavel Smirnov',
                email : 'ps@mail.co'
            }])
        }, 1000 )
    })
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