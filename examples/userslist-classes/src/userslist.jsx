import './main.css'
import ReactDOM from 'react-dom'

import React from 'react'
import PropTypes from 'proptypes'

import Link, { LinkedComponent } from 'valuelink'
import Modal from 'react-modal'
import {Input, isRequired, isEmail } from 'valuelink/tags'

export class UsersList extends LinkedComponent {
    state = {
        users   : [],
        dialog  : null,
        editing : null
    };

    render(){
        const $users = this.$at( 'users' ),
              { dialog, editing } = this.state;

        return (
            <div>
                <button onClick={ () => this.openDialog( 'addUser' ) }>
                    Add User
                </button>

                <Header/>

                { $users.map( ( $user, i ) => (
                    <UserRow key={ i }
                             $user={ $user }
                             onEdit={ () => this.openDialog( 'editUser', i ) }
                    />
                ) )}

                <Modal isOpen={ dialog === 'addUser' }>
                    <EditUser $user={ Link.value( {}, x => $users.push( x ) ) }
                              onClose={ this.closeDialog }/>
                </Modal>

                <Modal isOpen={ dialog === 'editUser' }>
                    <EditUser $user={ $users.at( editing ) }
                              onClose={ this.closeDialog }/>
                </Modal>
            </div>
        );
    }

    closeDialog = () => {
        this.setState( { dialog : null } );
    }

    openDialog( name, editing = null ){
        this.setState( { dialog : name, editing : editing } );
    }
}

const Header = () =>(
    <div className="users-row">
        <div>Name</div>
        <div>Email</div>
        <div>Is Active</div>
        <div/>
    </div>
);

const UserRow = ( { $user, onEdit } ) =>{
    const isActiveLink = $user.at( 'isActive' ),
          user         = $user.value;

    return (
        <div className="users-row" onDoubleClick={ onEdit }>
            <div>{ user.name }</div>
            <div>{ user.email }</div>
            <div onClick={ isActiveLink.action( x => !x ) }>
                { user.isActive ? 'Yes' : 'No' }</div>
            <div>
                <button onClick={ onEdit }>Edit</button>
                <button onClick={ () => $user.remove() }>X</button>
            </div>
        </div>
    )
};

class EditUser extends LinkedComponent{
    static propTypes = {
        $user : PropTypes.instanceOf( Link ).isRequired,
        onClose  : PropTypes.func.isRequired
    };

    state = {
        name     : '',
        email    : '',
        isActive : true
    };

    componentWillMount(){
        this.setState( this.props.$user.value );
    }

    onSubmit = e => {
        e.preventDefault();

        const { $user, onClose } = this.props;

        $user.set( this.state );
        onClose();
    }

    onCancel = () => {
        this.props.onClose();
    }

    render(){
        const user$ = this.state$();

        user$.name
              .check( isRequired )
              .check( x => x.indexOf( ' ' ) < 0, 'Spaces are not allowed' );

        user$.email
              .check( isRequired )
              .check( isEmail );

        return (
            <form onSubmit={ this.onSubmit }>
                <label>
                    Name: <ValidatedInput type="text" $value={ user$.name }/>
                </label>

                <label>
                    Email: <ValidatedInput type="text" $value={ user$.email }/>
                </label>

                <label>
                    Is active: <Input type="checkbox" $checked={ user$.isActive }/>
                </label>

                <button type="submit" disabled={ Link.hasErrors( user$ ) }>
                    Save
                </button>
                <button type="button" onClick={ this.onCancel }>
                    Cancel
                </button>
            </form>
        );
    }
}

const ValidatedInput = ( props ) => (
    <div>
        <Input { ...props } />
        <div className="validation-error">
            { props.$value.error || '' }
        </div>
    </div>
);

ReactDOM.render( <UsersList />, document.getElementById( 'app-mount-root' ) );
