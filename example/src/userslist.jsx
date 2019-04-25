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
        const usersLink = this.linkAt( 'users' ),
              { dialog, editing } = this.state;

        return (
            <div>
                <button onClick={ () => this.openDialog( 'addUser' ) }>
                    Add User
                </button>

                <Header/>

                { usersLink.map( ( userLink, i ) => (
                    <UserRow key={ i }
                             userLink={ userLink }
                             onEdit={ () => this.openDialog( 'editUser', i ) }
                    />
                ) )}

                <Modal isOpen={ dialog === 'addUser' }>
                    <EditUser userLink={ Link.value( {}, x => usersLink.push( x ) ) }
                              onClose={ this.closeDialog }/>
                </Modal>

                <Modal isOpen={ dialog === 'editUser' }>
                    <EditUser userLink={ usersLink.at( editing ) }
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

const UserRow = ( { userLink, onEdit } ) =>{
    const isActiveLink = userLink.at( 'isActive' ),
          user         = userLink.value;

    return (
        <div className="users-row" onDoubleClick={ onEdit }>
            <div>{ user.name }</div>
            <div>{ user.email }</div>
            <div onClick={ isActiveLink.action( x => !x ) }>
                { user.isActive ? 'Yes' : 'No' }</div>
            <div>
                <button onClick={ onEdit }>Edit</button>
                <button onClick={ () => userLink.remove() }>X</button>
            </div>
        </div>
    )
};

class EditUser extends LinkedComponent{
    static propTypes = {
        userLink : PropTypes.instanceOf( Link ).isRequired,
        onClose  : PropTypes.func.isRequired
    };

    state = {
        name     : '',
        email    : '',
        isActive : true
    };

    componentWillMount(){
        this.setState( this.props.userLink.value );
    }

    onSubmit = e => {
        e.preventDefault();

        const { userLink, onClose } = this.props;

        userLink.set( this.state );
        onClose();
    }

    onCancel = () => {
        this.props.onClose();
    }

    render(){
        const linked = this.linkAll();

        linked.name
              .check( isRequired )
              .check( x => x.indexOf( ' ' ) < 0, 'Spaces are not allowed' );

        linked.email
              .check( isRequired )
              .check( isEmail );

        return (
            <form onSubmit={ this.onSubmit }>
                <label>
                    Name: <ValidatedInput type="text" valueLink={ linked.name }/>
                </label>

                <label>
                    Email: <ValidatedInput type="text" valueLink={ linked.email }/>
                </label>

                <label>
                    Is active: <Input type="checkbox" checkedLink={ linked.isActive }/>
                </label>

                <button type="submit" disabled={ linked.name.error || linked.email.error }>
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
            { props.valueLink.error || '' }
        </div>
    </div>
);

ReactDOM.render( <UsersList />, document.getElementById( 'app-mount-root' ) );
