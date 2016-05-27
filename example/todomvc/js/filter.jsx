import React from 'nestedreact'

const Filter = ( { count, filterLink, onClear } ) => (
    <footer className="footer">
		<span className="todo-count">
			<strong>{ count }</strong> item left
		</span>

        <ul className="filters">
            <li>
                <Radio checkedLink={ filterLink.equals( null ) } href="#/">
                    All
                </Radio>
            </li>
            <li>
                <Radio checkedLink={ filterLink.equals( false ) } href="#/active">
                    Active
                </Radio>
            </li>
            <li>
                <Radio checkedLink={ filterLink.equals( true ) } href="#/completed">
                    Completed
                </Radio>
            </li>
        </ul>

        <button className="clear-completed" onClick={ onClear }>
            Clear completed
        </button>
    </footer>
);

export default Filter;

const Radio = ( { checkedLink, children, ...props } ) => (
    <a className={ checkedLink.value ? 'selected' : '' }
       onClick={ () => checkedLink.set( true ) }
        { ...props }>
        { children }
    </a>
);
