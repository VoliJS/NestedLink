import React from 'react'
import cx from 'classnames'
import Link, { useLink } from '@linked/react'

const allDone = $todos =>
    Link.value(
        $todos.value.every( todo => todo.done ),
        x => {
            $todos.update( todos => {
                todos.forEach( todo => todo.done = Boolean( x ) );
                return todos;
            });
        }
    );

export const TodoList = ({ $todos, filterDone }) => {
    const $editing = useLink( null ),
        $allDone = allDone( $todos );

    return (
        <section className="main">
            <input id="toggle-all" className="toggle-all" type="checkbox"
                    { ...$allDone.props }/>

            <label htmlFor="toggle-all">Mark all as complete</label>

            <ul className="todo-list">
                { $todos.map( ( $todo, i ) => {
                    if( filterDone === null || filterDone === $todo.value.done ){
                        return <TodoItem key={ i } $todo={ $todo }
                                            $editing={ $editing }/>;
                    }
                } ) }
            </ul>
        </section>
    );
}

function clearOnEnter( x, e ){
    if( e.keyCode === 13 ) return null;
}

const TodoItem = ( { $todo, $editing } ) =>{
    const editing   = $editing.value === $todo.key,
          todo = $todo.value,
          className = cx( {
              'completed' : todo.done,
              'view'      : !todo.done,
              'editing'   : editing
          } );

    return (
        <li className={ className }>
            <div className="view">
                <input className="toggle" type="checkbox"
                       { ...$todo.at( 'done' ).props }/>

                <label onDoubleClick={ $editing.action( () => $todo.key ) }>
                    { todo.desc }
                </label>

                <button className="destroy" onClick={ () => $todo.remove() }/>
            </div>

            { editing && <input className="edit"
                                { ...$todo.at( 'desc' ).props }
                                autoFocus={ true }
                                onBlur={ $editing.action( () => null ) }
                                onKeyDown={ $editing.action( clearOnEnter ) }/> }
        </li>
    );
};
