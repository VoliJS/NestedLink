import { PurePtr } from '@pure-ptr/react';
import React from 'react'

export const Header = () =>(
    <div className="users-row">
        <div>Name</div>
        <div>Email</div>
        <div>Is Active</div>
        <div/>
    </div>
);

export const UserRow = ( { userPtr, onEdit } : {
    userPtr : PurePtr<{ name : string, email : string, isActive : boolean }>,
    onEdit : () => void
}) =>{
    const user = userPtr.value;

    return (
        <div className="users-row" onDoubleClick={ onEdit }>
            <div>{ user.name }</div>
            <div>{ user.email }</div>
            <div onClick={ () => userPtr.at( 'isActive' ).update( x => !x ) }>
                { user.isActive ? 'Yes' : 'No' }</div>
            <div>
                <button onClick={ onEdit }>Edit</button>
                <button onClick={ () => userPtr.removeSelf() }>X</button>
            </div>
        </div>
    )
};
