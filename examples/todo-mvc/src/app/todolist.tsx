import React from 'react'
import cx from 'classnames'
import { PurePtr, useStatePtr } from '@pure-ptr/react';

const allDone = ( todosPtr : PurePtr<Todo[]> )=>
    PurePtr.value(
        todosPtr.value.every( todo => todo.done ),

        done =>
            todosPtr.update( todos =>
                todos.map( todo => ({
                    ...todo, 
                    done : Boolean( done ) 
                }) )
            )
    );

export const TodoList = ({ todosPtr, filterDone }:{
    todosPtr : PurePtr<Todo[]>,
    filterDone : boolean|null
}) => {
    const editingPtr = useStatePtr<Todo|null>( null ),
        allDonePtr = allDone( todosPtr );

    return (
        <section className="main">
            <input id="toggle-all" className="toggle-all" type="checkbox"
                    { ...allDonePtr.props }/>

            <label htmlFor="toggle-all">Mark all as complete</label>

            <ul className="todo-list">
                { todosPtr
                    .filter( todo => filterDone === null || filterDone === todo.done )
                    .map( ( todoPtr, i ) => 
                        <TodoItem key={ i } todoPtr={ todoPtr }
                            editingPtr={ editingPtr }/>
                    ) }
            </ul>
        </section>
    );
}

export interface Todo {
    done: boolean;
    desc: string;
}

const TodoItem = ( { todoPtr, editingPtr }: {
    todoPtr : PurePtr<Todo>,
    editingPtr : PurePtr<Todo|null>
} ) =>{
    const editing   = editingPtr.value === todoPtr.value,
          todo = todoPtr.value,
          className = cx( {
              'completed' : todo.done,
              'view'      : !todo.done,
              'editing'   : editing
          } );

    return (
        <li className={ className }>
            <div className="view">
                <input className="toggle" type="checkbox"
                       { ...todoPtr.at( 'done' ).props }/>

                <label onDoubleClick={ () => editingPtr.set( todoPtr.value ) }>
                    { todo.desc }
                </label>

                <button className="destroy" onClick={ () => todoPtr.removeSelf() }/>
            </div>

            { editing && 
                <input className="edit"
                    { ...todoPtr.at( 'desc' ).props }
                    autoFocus={ true }
                    onBlur={ () => editingPtr.set( null ) }
                    onKeyDown={ e => {
                        if( e.keyCode === 13 ) {
                            editingPtr.set( null )
                        }
                    }}
                /> 
            }
        </li>
    );
};
