import React from 'react'

export const Header = () =>(
    <div className="users-row">
        <div>Name</div>
        <div>Email</div>
        <div>Is Active</div>
        <div/>
    </div>
);

export const UserRow = ( { $user, onEdit } ) =>{
    const $isActive = $user.at( 'isActive' ),
          user      = $user.value;

    return (
        <div className="users-row" onDoubleClick={ onEdit }>
            <div>{ user.name }</div>
            <div>{ user.email }</div>
            <div onClick={ $isActive.action( x => !x ) }>
                { user.isActive ? 'Yes' : 'No' }</div>
            <div>
                <button onClick={ onEdit }>Edit</button>
                <button onClick={ () => $user.remove() }>X</button>
            </div>
        </div>
    )
};

