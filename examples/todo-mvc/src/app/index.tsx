import './app.css';
import React from 'react';
import { AddTodo } from './addtodo';
import { Filter } from './filter';
import { Todo, TodoList } from './todolist';
import { useLocalStoragePtr } from '@pure-ptr/react';

export const App = () => {
    const todosPtr = useLocalStoragePtr<Todo[]>( 'todos', [] ),
        filterDonePtr = useLocalStoragePtr<boolean|null>( 'done', null ),
        hasTodos = Boolean( todosPtr.value.length );

    return (
        <div>
            <section className="todoapp">
                <AddTodo onEnter={ desc => todosPtr.push({ done : false, desc : desc }) }/>

                { hasTodos && <TodoList todosPtr={ todosPtr }
                                        filterDone={ filterDonePtr.value }
                /> }

                { hasTodos && <Filter count={ getActiveCount( todosPtr.value ) }
                                        filterPtr={ filterDonePtr }
                                        onClear={ () => {
                                            todosPtr.remove( todo => todo.done ) 
                                        }}
                />}
            </section>

            <footer className="info">
                <p>Double-click to edit a todo</p>
                <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
                <p>Created by <a href="http://todomvc.com">Vlad Balin</a></p>
                <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
            </footer>
        </div>
    );
}

function getActiveCount( todos: Todo[] ){
    return todos.reduce( ( count, x ) => (
        x.done ? count : count + 1
    ), 0 );
}
