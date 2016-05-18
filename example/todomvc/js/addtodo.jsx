import React from 'nestedreact'
import { Input } from 'valuelink/tags.jsx'

const AddTodo = React.createClass( {
    props : {
        onEnter : Function.value( function(){} )
    },

    state : {
        desc : String
    },

    render(){
        return (
            <header className="header">
                <h1>todos</h1>

                <Input className="new-todo" placeholder="What needs to be done?" autofocus
                       valueLink={ this.state.getLink( 'desc' ) }
                       onKeyDown={ this.onKeyDown }
                />
            </header>
        );
    },

    onKeyDown( { keyCode } ){
        if( keyCode === 13 ){
            let { state, props } = this;

            state.desc && props.onEnter( state.desc );
            state.desc = "";
        }
    }
} );

export default AddTodo;
