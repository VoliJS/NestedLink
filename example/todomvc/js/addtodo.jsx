import React from 'react'
import { LinkedComponent } from 'valuelink';

export default class AddTodo extends LinkedComponent {
    state = {
        desc : ""
    }

    render(){
        return (
            <header className="header">
                <h1>todos</h1>

                <input className="new-todo" placeholder="What needs to be done?" autoFocus
                       { ...this.linkAt( 'desc' ).props }
                       onKeyDown={ this.onKeyDown }
                />
            </header>
        );
    }

    onKeyDown = ( { keyCode } ) =>{
        if( keyCode === 13 ){
            let { state, props } = this;

            state.desc && props.onEnter( state.desc );
            state.desc = "";
        }
    }
}
