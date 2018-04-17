import 'css/app.css'
import React from 'react'
import ReactDOM from 'react-dom'
import TodoList from './todolist.jsx'
import Filter from './filter.jsx'
import AddTodo from './addtodo.jsx'
import { LinkedComponent } from 'valuelink'

function removeDone( todos ){
    return todos.filter( todo => !todo.done );
}

class App extends LinkedComponent {
    state = {
        todos : [],
        filterDone : null
    }

    getActiveCount(){
        return this.state.todos.reduce( ( count, x ) => (
            x.done ? count : count + 1
        ), 0 );
    }

    componentWillMount(){
        const json = JSON.parse( localStorage.getItem( 'todo-mvc' ) || "{}" );

        // initialize state with raw JSON
        this.setState( json );

        window.onunload = () =>{
            // Save state back to the local storage
            localStorage.setItem( 'todo-mvc', JSON.stringify( this.state ) );
        }
    }

    render(){
        const links = this.linkAll(),
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
}

ReactDOM.render( <App />, document.getElementById( 'app-mount-root' ) );

