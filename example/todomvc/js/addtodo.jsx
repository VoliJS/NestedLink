import React from 'react'
import { useLink } from 'valuelink';

export const AddTodo = ({ onEnter }) => {
    const desc = useLink('');

    function onKeyDown( { keyCode } ){
        if( keyCode === 13 ){
            desc.value && onEnter( desc.value );
            desc.set("");
        }
    }

    return (
        <header className="header">
            <h1>todos</h1>

            <input className="new-todo" placeholder="What needs to be done?" autoFocus
                   { ...desc.props }
                   onKeyDown={ onKeyDown }
            />
        </header>
    );
}
