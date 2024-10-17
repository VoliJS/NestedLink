import React from 'react'
import { useStatePtr } from '@pure-ptr/react';

export const AddTodo = ({ onEnter } : {
    onEnter : ( desc : string ) => void
}) => {
    const descPtr = useStatePtr('');

    return (
        <header className="header">
            <h1>todos</h1>

            <input className="new-todo" 
                placeholder="What needs to be done?" 
                autoFocus
                { ...descPtr.props }

                onKeyDown={ ( { keyCode }: { keyCode: number } ) =>{
                    if( keyCode === 13 ){
                        descPtr.value && onEnter( descPtr.value );
                        descPtr.set("");
                    }
                } }
            />
        </header>
    );
}
