import 'css/app.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { useLinked, useLocalStorage } from '@linked/react';
import { AddTodo } from './addtodo.jsx';
import { Filter } from './filter.jsx';
import { TodoList } from './todolist.jsx';

const App = () => {
    const $todos = useLinked( [] ),
        $filterDone = useLinked( null ),
        hasTodos = Boolean( $todos.value.length );

    useLocalStorage( 'todos', { $todos, $filterDone });

    return (
        <div>
            <section className="todoapp">
                <AddTodo onEnter={ desc => $todos.push({ done : false, desc : desc }) }/>

                { hasTodos && <TodoList $todos={ $todos }
                                        filterDone={ $filterDone.value }
                /> }

                { hasTodos && <Filter count={ getActiveCount( $todos ) }
                                        $filter={ $filterDone }
                                        onClear={ $todos.action( removeDone ) }
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

function removeDone( todos ){
    return todos.filter( todo => !todo.done );
}

function getActiveCount( todos ){
    return todos.value.reduce( ( count, x ) => (
        x.done ? count : count + 1
    ), 0 );
}


const appRoot = document.getElementById( 'app-mount-root' );
ReactDOM.render( <App />, appRoot );
window.addEventListener("unload", () => ReactDOM.unmountComponentAtNode( appRoot ) );

