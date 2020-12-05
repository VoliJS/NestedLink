import './main.css';
import React from 'react'
import ReactDOM from 'react-dom';
import { useLinked } from '@linked/react'

// Optional form control wrappers taking links as $value and $checked
import { Input, isRequired } from '@linked/controls'

const App = () => {
    const $firstName = useLinked('John'),
        $secondName = useLinked('').check( isRequired );

    return (
        <div>
            <input {...$firstName.props} />
            <Input $value={$secondName} />
        </div>
    )
}

// Start the application...
ReactDOM.render( <App />, document.getElementById( 'app-mount-root' ) );
