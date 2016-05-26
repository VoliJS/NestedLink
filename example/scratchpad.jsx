function

render() {
    const linked = Link.all( this, 'name', 'email', 'isActive' );

    return (
        <form onSubmit={ this.onSubmit }>
            <label>
                Name: <Input type="text" valueLink={ linked.name }/>
            </label>

            <label>
                Email: <Input type="text" valueLink={ linked.email }/>
            </label>

            <label>
                Is active: <Input type="checkbox" checkedLink={ linked.isActive }/>
            </label>

            <button type="submit">Add User</button>
        </form>
    );
}


var user =
    {
        name     : '',
        email    : '',
        isActive : true
    }

const x = () => (
    <Modal isOpen={ showEditUserDialog }>
        <EditUser userLink={ linkToUser }
                  onClose={ closeDialog }/>
    </Modal>
)


export const UsersList = React.createClass( {
    getInitialState(){
        return {
            users : [ {
                name     : 'admin',
                email    : 'admin@google.com',
                isActive : true
            } ]
        }
    },

    render(){
        return (
            <div>
                <Header/>

                { this.state.users.map( ( user, i ) => (
                    <UserRow key={ i } user={ user }/>
                ) )}
            </div>
        );
    }
} );

const Header = () =>(
    <div className="users-row">
        <div>Name</div>
        <div>Email</div>
        <div>Is Active</div>
        <div/>
    </div>
);

const UserRow = ( { userLink } ) =>{
    const isActiveLink = userLink.at( 'isActive '),
          user         = userLink.value;

    return (
        <div className="users-row">
            <div>{ user.name }</div>
            <div>{ user.email }</div>
            <div onClick={ () => isActiveLink.set( !isActiveLink.value ) }>
                { user.isActive ? 'Yes' : 'No' }</div>
            <div>
                <button>Edit</button>
                <button>X</button>
            </div>
        </div>
    )
}

export const UsersList = React.createClass( {
    getInitialState(){
        return {
            users : [ {
                name     : 'admin',
                email    : 'admin@google.com',
                isActive : true
            } ]
        }
    },

    render(){
        const usersLink = Link.state( this, 'users' );

        return (
            <div>
                <Header/>

                { usersLink.map( ( userLink, i ) => (
                    <UserRow key={ i } userLink={ userLink } onEdit={ () => this.edit( i ) }/>
                ) )}
            </div>
        );
    }
} );

const UserRow = ( { userLink, onEdit } ) =>{
    const isActiveLink = userLink.at( 'isActive' ),
          user         = userLink.value;

    return (
        <div className="users-row">
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

export const UsersList = React.createClass( {
    getInitialState(){
        return {
            users   : [],
            dialog  : null,
            editing : null
        }
    },

    closeDialog(){
        this.setState( { dialog : null } );
    },

    openDialog( name, editing = null ){
        this.setState( { dialog : name, editing : editing } );
    },

    render(){
        const usersLink = Link.state( this, 'users' ),
              { dialog, editing } = this.state;

        return (
            <div>
                <Header/>

                { usersLink.map( ( userLink, i ) => (
                    <UserRow key={ i }
                             userLink={ userLink }
                             onEdit={ () => this.openDialog( 'editUser', i ) }
                    />
                ) )}

                <Modal isOpen={ dialog === 'editUser' }>
                    <EditUser userLink={ usersLink.at( editing ) }
                              onClose={ this.closeDialog }/>
                </Modal>
            </div>
        );
    }
} );