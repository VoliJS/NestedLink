import React from 'react'
import ReactDOM from 'react-dom'
import Link from '../valuelink'
import { Input } from '../tags'

class EditableLabel extends React.Component {
    state =  { editing : null };

    render(){
        const { value } = this.props.textLink,
                editingLink = Link.state( this, 'editing' );

        return editingLink.value === null ? (
            <div onClick={ () => editingLink.set( value ) }>{ value }</div>
        ) : (
            <div>
                <Input valueLink={ editingLink }
                       autoFocus={ true } onBlur={ () => editingLink.set( null ) }
                />
                <button onClick={ this.save }> Save </button>
            </div>
        );
    }

    save = () => {
        this.props.textLink.set( this.state.editing );
        this.setState({ editing : null });
    }
}

class App extends React.Component {
    state = {
        labels : [ 'how', 'it', 'will', 'be', 'in', 'elm?' ]
    };

    render(){
        const labelsLink = Link.state( this, 'labels' );

        return (
            <div>
                { labelsLink.map( ( labelLink, i ) => (
                    <EditableLabel key={ i } textLink={ labelLink } />
                ))}

                <button onClick={ () => labelsLink.push( 'Wat?' ) }>Add</button>
            </div>
        )
    }
}

ReactDOM.render( <App />, document.getElementById( 'app-mount-root' ) );
