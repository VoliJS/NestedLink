# Basics

PurePtr introduces a pointer-based approach to React state management. Instead of juggling multiple `useState` hooks, PurePtr returns pointer objects that encapsulate get, set, and update operations. This approach scales seamlessly from simple values to nested objects and arrays, resulting in clearer, more maintainable code. Below, you’ll find four core examples—primitive counters, form fields, object properties, and dynamic lists—each paired with an equivalent vanilla React state implementation for easy comparison.

## Simple state

In this example, you’ll learn how to create a counter using `useStatePtr`, which returns a pointer with `value`, `update`, and `set` methods. This pointer can be passed to child components, streamlining state access and mutation compared to separate setter functions. The right-hand pane shows a traditional `useState` version for comparison.

=== "PurePtr"
    ```javascript
    const Page = () => {
        const counterPtr = useStatePtr(0);

        return (
            <Counter valuePtr={ counterPtr }/>
        )
    }

    const Counter = ({ valuePtr }) =>
        <form>
            <h1> { valuePtr.value } </h1>

            <button onClick={ () => 
                valuePtr.update( x => x + 1 )
            }>
                Increment
            </button>

            <button onClick={ () => 
                valuePtr.set( 0 )
            }>
                Reset
            </button>
        </form>
    ```

=== "React state"
    ```javascript
    const Page = () => {
        const [ counter, setCounter ] = useState(0);

        return (
            <Counter value={ counter } onChange={ setCounter } />
        )
    }

    const Counter = ({ value, onChange }) =>
        <form>
            <h1> { value } </h1>

            <button onClick={ () => 
                onChange( value + 1 )
            }>
                Increment
            </button>

            <button onClick={ () => 
                onChange( 0 )
            }>
                Reset
            </button>
        </form>
    ```

## Simple Forms

Here we build a simple form with name and email fields using `useStatePtr`. Each pointer hooks into an input’s `value` and `onChange` automatically, reducing boilerplate. On the right, the `useState` example demonstrates handling each field with separate state and handlers.

=== "PurePtr"
    ```javascript
    const User = () => {
        const namePtr = useStatePtr(''),
            emailPtr = useStatePtr('');

        return (
            <form>
                <label>
                    Email
                    <input {...emailPtr.props} />
                </label>
                
                <label>
                    Name
                    <Input valuePtr={ namePtr } />
                </label>
            </form>
        )
    }

    const Input = ({ valuePtr }) =>
        <input
            value={ namePtr.value }
            onChange={ e => namePtr.set( e.target.value ) }
        />
    ```
=== "React state"
    ```javascript
    const User = () => {
        const [ name, setName ] = useState(''),
              [ email, setEmail ] = useState('');

        return (
            <form>
                <label>
                    Email
                    <input
                        value={ email }
                        onChange={ e => setEmail(e.target.value) }
                    />
                </label>
                
                <label>
                    Name
                    <Input
                        value={ name }
                        onChange={ setName }
                    />
                </label>
            </form>
        );
    }

    const Input = ({ value, onChange }) =>
        <input
            value={ value }
            onChange={ e => onChange(e.target.value) }
        />;
    ```

## Objects in state

This example demonstrates managing an entire object in state with `useStatePtr`. Using `statePtr.at('key')`, you derive pointers to nested properties and update them in place, avoiding manual object spread operations. The adjacent `useState` example shows manual merging of object fields.

=== "PurePtr"
    ```javascript
    const initialState = {
        name: '',
        email: ''
    }

    const User = () => {
        const statePtr = useStatePtr( initialState );

        return (
            <form>
                <label>
                    Email
                    <input {...statePtr.at('email').props} />
                </label>
                
                <label>
                    Name
                    <Input valuePtr={ statePtr.at('name') } />
                </label>
            </form>
        )
    }

    const Input = ({ valuePtr }) =>
        <input
            value={ namePtr.value }
            onChange={ e => namePtr.set( e.target.value ) }
        />
    ```
=== "React state"
    ```javascript
    const initialState = { 
        name: '', 
        email: '' 
    };

    const User = () => {
        const [ state, setState ] = useState(initialState);

        return (
            <form>
                <label>
                    Email
                    <input
                        value={ state.email }
                        onChange={ e => setState(prev => ({ ...prev, email: e.target.value })) }
                    />
                </label>
                
                <label>
                    Name
                    <Input
                        value={ state.name }
                        onChange={ value => setState(prev => ({ ...prev, name: value })) }
                    />
                </label>
            </form>
        );
    }

    const Input = ({ value, onChange }) =>
        <input
            value={ value }
            onChange={ e => onChange(e.target.value) }
        />;
    ```

## Lists in state

In this example, we manage an array of items using `useStatePtr`. Mapping over `itemsPtr` yields pointers for each element, enabling direct updates. The standard `useState` version illustrates array updates by copying and setting a new array.

=== "PurePtr"
    ```javascript
    const initialItems = ['', '', ''];

    const ListInputs = () => {
        const itemsPtr = useStatePtr( initialItems );

        return (
            <div>
                {itemsPtr.map((itemPtr, index) => (
                    <Input
                        key={index}
                        valuePtr={itemPtr}
                    />
                ))}
            </div>
        );
    };

    const Input = ({ valuePtr }) =>
        <input
            value={ namePtr.value }
            onChange={ e => namePtr.set( e.target.value ) }
        />
    ```

=== "React state"
    ```javascript
    const initialItems = ['', '', ''];

    const ListInputs = () => {
        const [items, setItems] = useState( initialItems );

        return (
            <div>
                {items.map((item, index) => (
                    <Input
                        key={index}
                        value={item}
                        onChange={value => {
                            const newItems = [...items];
                            newItems[index] = value;
                            setItems(newItems);
                        }}
                    />
                ))}
            </div>
        );
    };

    const Input = ({ value, onChange }) =>
        <input
            value={ value }
            onChange={ e => onChange(e.target.value) }
        />;
    ```
