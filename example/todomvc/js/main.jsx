import 'css/app.css'
import React from 'nestedreact'
import ReactDOM from 'react-dom'
import {ToDo} from './model.js'
import TodoList from './todolist.jsx'
import Filter from './filter.jsx'
import AddTodo from './addtodo.jsx'


function removeDone( todos ){
    return todos.filter( todo => !todo.done );
}

const App = React.createClass( {
    // Declare component state
    getInitialState(){
        return {
            todos : [],
            filterDone : null
        }
    },

    getActiveCount(){
        let count = 0;
        this.todos.forEach( todo => todo.done || count++ );
        return count;
    },

    componentWillMount(){
        const json = JSON.parse( localStorage.getItem( 'todo-mvc' ) || "{}" );

        // initialize state with raw JSON
        this.setState( json );

        window.onunload = () =>{
            // Save state back to the local storage
            localStorage.setItem( 'todo-mvc', JSON.stringify( this.state ) );
        }
    },

    render(){
        const links = Link.all( this, 'todos', 'filterDone' ),
              { todos, filterDone } = this.state,
              hasTodos = Boolean( todos.length );

        return (
            <div>
                <section className="todoapp">
                    <AddTodo onEnter={ desc => links.todos.push({ done : false, desc : desc }) }/>

                    { hasTodos && <TodoList todosLink={ links.todos }
                                            filterDone={ filterDone }
                    /> }

                    { hasTodos && <Filter count={ this.getActiveCount() }
                                          filterLink={ links.filterDone }
                                          onClear={ links.todos.action( removeDone ) }
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
} );

ReactDOM.render( <App />, document.getElementById( 'app-mount-root' ) );

