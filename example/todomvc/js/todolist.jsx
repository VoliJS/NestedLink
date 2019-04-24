import React from 'react'
import cx from 'classnames'
import Link, { useLink } from 'valuelink'

export const TodoList = ({ todosLink, filterDone }) => {
    const editingLink = useLink( null ),
        allDoneLink = Link.value(
            todosLink.value.every( todo => todo.done ),
            x => {
                todosLink.update( todos => {
                    todos.forEach( todo => todo.done = Boolean( x ) );
                    return todos;
                });
            }
        );

    return (
        <section className="main">
            <input id="toggle-all" className="toggle-all" type="checkbox"
                    { ...allDoneLink.props }/>

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
                <input className="toggle" type="checkbox"
                       { ...todoLink.at( 'done' ).props }/>

                <label onDoubleClick={ editingLink.action( () => todoLink.key ) }>
                    { todo.desc }
                </label>

                <button className="destroy" onClick={ () => todoLink.remove() }/>
            </div>

            { editing && <input className="edit"
                                { ...todoLink.at( 'desc' ).props }
                                autoFocus={ true }
                                onBlur={ editingLink.action( () => null ) }
                                onKeyDown={ editingLink.action( clearOnEnter ) }/> }
        </li>
    );
};
