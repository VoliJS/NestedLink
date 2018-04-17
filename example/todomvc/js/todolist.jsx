import React from 'react'
import PropTypes from 'proptypes'
import cx from 'classnames'
import Link, { LinkedComponent } from 'valuelink'

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

class TodoList extends LinkedComponent {
    static propTypes = {
        todosLink  : PropTypes.instanceOf( Link ),
        filterDone : PropTypes.bool
    }

    state = {
        editing : null
    }

    render(){
        const { todosLink, filterDone } = this.props,
              editingLink = Link.state( this, 'editing' ),
              allDoneLink = new AllDoneLink( todosLink );

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
}

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
