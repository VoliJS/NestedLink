import 'babel-polyfill';
import './main.css';
import React from 'react'
import ReactDOM from 'react-dom';
import { useLink } from 'valuelink'

import { Autocomplete } from './autocomplete.jsx'

const App = () => {
    const $selected = useLink( null );

    return (
        <div>
            <p>
                Select the user with the server-side autocomplete. Start typing, and after 1 second you stop
                the request to the server will be issued, showing you the best matches.
            </p>
            <p>
                We don't really have a server, so all you've got is a cheap simulation with a local JS setTimeout function.
                Thus, no server-side filtering, sorry. Just a fixed list of cool guys, no matter what you type.
                But use your imagination. Imagination is more important than knowledge.
            </p>
            <Autocomplete $selected={$selected} />

            <p>
                Here is the <a href="https://github.com/VoliJS/NestedLink/examples/autocomplete/src">source code</a>.
            </p>
        </div>
    )
}

// Start the application...
ReactDOM.render( <App />, document.getElementById( 'app-mount-root' ) );
