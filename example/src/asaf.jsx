import React from 'react'
import PropTypes from 'proptypes'
import ReactDOM from 'react-dom'
import Link, { LinkedComponent } from 'valuelink'
import { Input } from 'valuelink/tags'

class EditableLabel extends LinkedComponent {
    static propTypes = {
        textLink : PropTypes.instanceOf( Link )
    }

    state =  { editing : null };

    render(){
        const { value } = this.props.textLink,
                editingLink = this.linkAt( 'editing' );

        return editingLink.value === null ? (
            <div onClick={ () => editingLink.set( value ) }>{ value }</div>
        ) : (
            <div onBlur={ () => editingLink.set( null ) }>
                <Input valueLink={ editingLink } autoFocus={ true }
                       onKeyDown={ e => e.keyCode == 13 && this.save() }/>
                <button onMouseDown={ this.save }> Save </button>
            </div>
        );
    }

    save = () => {
        this.props.textLink.set( this.state.editing );
        this.setState({ editing : null });
    }
}

class App extends LinkedComponent {
    state = {
        labels : [ 'how', 'it', 'will', 'be', 'in', 'elm?' ]
    };

    render(){
        const labelsLink = this.linkAt( 'labels' );

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
