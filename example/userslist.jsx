import './main.css'
import ReactDOM from 'react-dom'

import React, { PropTypes } from 'react'

import Link from 'valuelink'
import Modal from 'react-modal'
import { Input } from 'tags.jsx'

export const UsersList = React.createClass( {
    getInitialState(){
        return {
            users   : [],
            dialog  : null,
            editing : null
        }
    },

    render(){
        const usersLink = Link.state( this, 'users' ),
              { dialog, editing } = this.state;

        return (
            <div>
                    Add User
                </button>

                { usersLink.map( ( userLink, i ) => (
                    <UserRow key={ i }
                             userLink={ userLink }
                             onEdit={ () => this.openDialog( 'editUser', i ) }
                    />
                ) )}

                <Modal isOpen={ dialog === 'addUser' }>
                    <EditUser userLink={ Link.value( {}, x => usersLink.push( x ) ) }
                              onClose={ this.closeDialog }/>;
                </Modal>

                <Modal isOpen={ dialog === 'editUser' }>
                    <EditUser userLink={ usersLink.at( editing ) }
                              onClose={ this.closeDialog }/>;
                </Modal>
            </div>
        );
    },

    closeDialog(){
        this.setState( { dialog : null } );
    },

    openDialog( name, editing = null ){
        this.setState( { dialog : name, editing : editing } );
    }
} );

const UserRow = ({ userLink, onEdit }) =>{
    const isActiveLink = userLink.at( 'isActive' ),
          user = userLink.value;

    return (
        <div onDoubleClick={ onEdit }>
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

const EditUser = React.createClass( {
    propTypes : {
        userLink : PropTypes.instanceOf( Link ).isRequired,
        onClose  : PropTypes.func.isRequired
    },

    getInitialState(){
        return {
            name : '',
            email : '',
            isActive : true
        }
    },

    componentWillMount(){
        this.setState( this.props.userLink.value );
    },

    onSubmit( e ){
        e.preventDefault();

        const { userLink, onClose } = this.props;

        userLink.set( this.state );
        onClose();
    },

    onCancel(){
        this.props.onClose();
    },

    render(){
        const linked = Link.all( this, 'name', 'email', 'isActive' );

        return (
            <form onSubmit={ this.onSubmit }>
                <label>
                    Name: <Input type="text"
                                 valueLink={ linked.name } />
                </label>

                <label>
                    Email: <Input type="text"
                                  valueLink={ linked.email } />
                </label>

                <label>
                    Is active: <Input type="checkbox"
                                      valueLink={ linked.isActive } />
                </label>

                <button type="submit"> Save </button>
                <button type="button" onClick={ this.onCancel }>
                    Cancel
                </button>
            </form>
        );
    }
} );



ReactDOM.render( <UsersList />, document.getElementById( 'app-mount-root' ) );