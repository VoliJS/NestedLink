import React from 'react'
import Link from '../valuelink'

export const UsersList = React.createClass( {
    getInitialState(){
        return {
            users   : [],
            dialog  : null,
            editing : null
        }
    },

    render(){
        const links = Link.all( this, 'users' ),
              { dialog } = this.state;

        return (
            <div>
                <button onClick={ () => this.dialog( 'addUser' ) }/>

                <Modal isOpen={ dialog }>
                    { dialog ? this[ dialog ]( links.users ) : void 0 }
                </Modal>

                { links.users.map( ( userLink, i ) => {
                    return <UserRow key={ i } userLink={ userLink }
                                    onDelete={ () => links.users.remove( i ) }
                                    onEdit={ () => this.dialog( 'editUser', i ) }
                    />;
                } )}
            </div>
        );
    },

    addUser( usersLink ){
        return <EditUser userLink={ Link.value( {}, x => usersLink.push( x ) ) }
                          onClose={ () => this.dialog( null ) }/>;
    },

    editUser( usersLink ){
        return <EditUser userLink={ usersLink.at( this.state.editing ) }
                          onClose={ () => this.dialog( null ) }/>;
    },

    dialog( name, editing = null ){
        this.setState( { dialog : name, editing : editing } );
    }
} );

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

    onSubmit(){
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
                    Is active: <Input type="text"
                                      valueLink={ linked.isActive } />
                </label>

                <button type="submit">Save</button>
                <button onClick={ this.onCancel }>
                    Cancel
                </button>
            </form>
        );
    }
} );

const UserRow = ({ user, onDelete, onEdit }) => (
    <div>
        <div>{ user.name }</div>
        <div>{ user.email }</div>
        <div>{ user.isActive ? 'Yes' : 'No' }</div>
        <div>
            <button onClick={ onEdit }>Edit</button>
            <button onClick={ onDelete }>X</button>
        </div>
    </div>
);