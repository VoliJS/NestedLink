import './main.css';
import React from 'react'
import ReactDOM from 'react-dom';
import { useLink } from 'valuelink'

const App = () => {
    const $input = useLink('');

    return (
        <input {...$input.props} />
    )
}

// Start the application...
ReactDOM.render( <App />, document.getElementById( 'app-mount-root' ) );
