import React, { PropTypes } from 'react'
import cx from 'classnames'
import { Input } from 'valuelink/tags.jsx'
import Link from 'valuelink'

class AllDoneLink extends Link{
    constructor( todosLink ){
        super( todosLink.value.every( todo => todo.done ) );
        this.parent = todosLink;
    }

    set( x ){
        this.parent.update( todos =>{
            todos.forEach( todo => todo.done = Boolean( x ) );
            return todos;
        });
    }
}

const TodoList = React.createClass( {
    propTypes : {
        todosLink  : PropTypes.instanceOf( Link ),
        filterDone : PropTypes.bool
    },

    getInitialState(){
        return {
            editing : null
        }
    },

    render(){
        const { todosLink, filterDone } = this.props,
              editingLink = Link.state( this, 'editing' );

        return (
            <section className="main">
                <Input className="toggle-all" type="checkbox"
                       checkedLink={ new AllDoneLink( todosLink ) }/>

                <label htmlFor="toggle-all">Mark all as complete</label>

                <ul className="todo-list">
                    { todosLink.map( ( todoLink, i ) => {
                        if( filterDone === null || filterDone === todoLink.value.done ){
                            return <TodoItem key={ i } todoLink={ todoLink }
                                             editingLink={ editingLink }/>;
                        }
                    } ) }
                </ul>
            </section>
        );
    }
} );

export default TodoList;

function clearOnEnter( x, e ){
    if( e.keyCode === 13 ) return null;
}

const TodoItem = ( { todoLink, editingLink } ) =>{
    const editing   = editingLink.value === todoLink.key,
          todo = todoLink.value,
          className = cx( {
              'completed' : todo.done,
              'view'      : !todo.done,
              'editing'   : editing
          } );

    return (
        <li className={ className }>
            <div className="view">
                <Input className="toggle" type="checkbox"
                       checkedLink={ todoLink.at( 'done' ) }/>

                <label onDoubleClick={ editingLink.action( () => todoLink.key ) }>
                    { todo.desc }
                </label>

                <button className="destroy" onClick={ () => todoLink.remove() }/>
            </div>

            { editing && <Input className="edit"
                                valueLink={ todoLink.at( 'desc' ) }
                                autoFocus={ true }
                                onBlur={ editingLink.action( () => null ) }
                                onKeyDown={ editingLink.action( clearOnEnter ) }/> }
        </li>
    );
};
