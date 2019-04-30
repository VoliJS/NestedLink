import React from 'react'

export const Filter = ( { count, $filter, onClear } ) => (
    <footer className="footer">
		<span className="todo-count">
			<strong>{ count }</strong> item left
		</span>

        <ul className="filters">
            <li>
                <Radio $checked={ $filter.equals( null ) } href="#/">
                    All
                </Radio>
            </li>
            <li>
                <Radio $checked={ $filter.equals( false ) } href="#/active">
                    Active
                </Radio>
            </li>
            <li>
                <Radio $checked={ $filter.equals( true ) } href="#/completed">
                    Completed
                </Radio>
            </li>
        </ul>

        <button className="clear-completed" onClick={ onClear }>
            Clear completed
        </button>
    </footer>
);

const Radio = ( { $checked, children, ...props } ) => (
    <a className={ $checked.value ? 'selected' : '' }
       onClick={ () => $checked.set( true ) }
        { ...props }>
        { children }
    </a>
);
