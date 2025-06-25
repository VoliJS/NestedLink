import { PurePtr } from '@pure-ptr/react';
import React from 'react'

export const Filter = ( { count, filterPtr, onClear } : {
    count : number,
    filterPtr : PurePtr<boolean | null>,
    onClear : () => void
}) => (
    <footer className="footer">
        <span className="todo-count">
            <strong>{ count }</strong> item left
        </span>

        <ul className="filters">
            <li>
                <Radio checkedPtr={ filterPtr.equals( null ) } href="#/">
                    All
                </Radio>
            </li>
            <li>
                <Radio checkedPtr={ filterPtr.equals( false ) } href="#/active">
                    Active
                </Radio>
            </li>
            <li>
                <Radio checkedPtr={ filterPtr.equals( true ) } href="#/completed">
                    Completed
                </Radio>
            </li>
        </ul>

        <button className="clear-completed" onClick={ onClear }>
            Clear completed
        </button>
    </footer>
);

const Radio = ( { checkedPtr, children, ...props } : React.HTMLProps<HTMLAnchorElement> &{
    checkedPtr : PurePtr<boolean>,
    children : React.ReactNode
}) => (
    <a className={ checkedPtr.value ? 'selected' : '' }
       onClick={ () => checkedPtr.set( true ) }
        { ...props }>
        { children }
    </a>
);
